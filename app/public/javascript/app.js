function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

async function postData(url = '', data = {}) {
    return await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(isIterable(data) ? Object.fromEntries(data) : data)
    });
}

async function getData(url = '') {
    return await fetch(url, {
        method: 'GET',
        mode: 'same-origin',
        cache: 'no-cache',
        headers: {
            'Accept': 'text/html',
            'Content-Type': 'text/html; charset=UTF-8'
        },
    });
}

function render400(response) {
    response.then(data => console.log('Response data', data))
    return response
}

function httpError(response) {
    return new Error(
        `Network response was not ok, Response status ${response.status}, status text ${response.statusText}`
    );
}

function onClickContextDropdownMenu() {
    const dropdownMenu = $('#contextDropdownMenu')
    dropdownMenu.on('show.bs.dropdown', function () {
        const container = document.getElementsByClassName('container-fluid')[0]
        container.classList.add('hide')
        container.classList.add('fade')
    })
    dropdownMenu.on('hide.bs.dropdown', function () {
        const container = document.getElementsByClassName('container-fluid')[0]
        container.classList.remove('hide')
        container.classList.remove('fade')
    })
}

function handleDocumentUpload() {
    const maxFiles = 10
    const fileElement = document.getElementById('documentIn')
    const draggableItems = document.getElementsByClassName('draggable-item')
    fileElement.addEventListener('change', () => {
        if (fileElement.files.length > 0) {
            const modalFooter = document.querySelector('#documentUpload .modal-footer')
            modalFooter.classList.remove("hide", "fade")
            handleFiles(fileElement.files, maxFiles)
            for (const key in draggableItems) {
                if (key >= fileElement.files.length) {
                    break
                }
                draggableItems[key].removeAttribute("hidden")
            }
        }
    }, false);

    const previewGroup = document.getElementById("preview")
    new Sortable(previewGroup, {
        animation: 300,
        handle: ".fa-arrows",
        ghostClass: 'draggable-ghost',
        chosenClass: "draggable-chosen",
        dragClass: "draggable-drag",
    })

    document
        .getElementById('saveDocumentBtn')
        .addEventListener('click', onClickSaveDocumentBtn)

    $('#documentUpload').on('hide.bs.modal', () => {
        for (let i = 0; i < fileElement.files.length && i < maxFiles; i++) {
            let preview = document.getElementById(`previewDocument${i + 1}`)
            preview.innerHTML = null
            preview.setAttribute("hidden", "hidden")
            let documentName = document.getElementsByClassName(`document-name-${i + 1}`)
            documentName[0].textContent = ''
        }
        fileElement.value = null
        document.getElementById('saveDocumentBtn').classList.add("disabled", "not-allowed")
        document.getElementById('documentName').value = '';
        for (const draggableItem of draggableItems) {
            draggableItem.setAttribute("hidden", "hidden")
        }
    })
}

function handleFiles(files, maxFiles) {
    const saveDocumentBtn = document.getElementById('saveDocumentBtn');

    for (let i = 0; i < files.length && i < maxFiles; i++) {
        const preview = document.getElementById(`previewDocument${i + 1}`);
        const documentName = document.getElementsByClassName(`document-name-${i + 1}`)
        const file = files[i]

        documentName[0].prepend((document.createTextNode(file.name)))
        if (!file.type.startsWith('application/pdf')) {
            preview.innerHTML
                = `<p 
class="alert alert-danger border-0 m-0" 
style="border-radius: 0;"
>Ungültiges Dateityp. Erlaubte Dateityp ist PDF.</p>`
            preview.removeAttribute("hidden")
            continue
        }

        preview.innerHTML = null
        preview.innerHTML = `<input type="hidden" name="positions[]" value="${i}">`
        const reader = new FileReader();
        reader.onload = () => {
            const obj = document.createElement("obj");
            const embed = document.createElement("embed");
            obj.setAttribute(
                "style",
                "min-height: 50vh; max-height: 500px; width:100%"
            )
            embed.setAttribute(
                "style",
                "min-height: 50vh; max-height: 500px; width:100%"
            )
            obj.setAttribute("type", "application/pdf")
            embed.setAttribute("type", "application/pdf")
            saveDocumentBtn.classList.remove("disabled", "not-allowed")
            saveDocumentBtn.getElementsByClassName('spinner-border')[0]
                .setAttribute("hidden", "hidden")
            const url = window.URL.createObjectURL(file, {type: "application/pdf"}) + "#toolbar=0"
            embed.setAttribute("src", url)
            embed.setAttribute("data", url)

            obj.appendChild(embed)
            preview.appendChild(obj)
            preview.removeAttribute("hidden")
        }
        reader.readAsDataURL(file);
    }
}

function onClickSaveDocumentBtn(event) {
    event.preventDefault()
    event.stopPropagation()

    if (event.target.classList.contains("disabled")) {
        return
    }
    const form = document.getElementById("documentUploadForm")
    const container = document.getElementById("documentUpload")
    if (form.checkValidity() === false) {
        form.classList.add("was-validated")
        container.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })

        return;
    }

    event.target.classList.add("disabled", "not-allowed")
    event.target.getElementsByClassName('spinner-border')[0]
        .removeAttribute("hidden")

    const formData = new FormData(form);

    const response = fetch(event.target.href, {
        method: "POST",
        mode: "same-origin",
        cache: "no-cache",
        body: formData
    });

    response.then((response) => {
        const modalFooter = document.querySelector('#documentUpload .modal-footer')
        const info = document.createElement('div')
        modalFooter.remove()
        if (response.ok && response.status === 201) {

            info.classList.add("alert", "alert-success")
            info.textContent = "Dokument erfolgreich gespeichert."
            setTimeout(() => window.location.href = event.target.dataset.redirectUrl, 1234)
        } else {
            document.querySelector('#documentUpload .close')
                .setAttribute("hidden", "hidden")
            info.classList.add("alert", "alert-danger")
            info.textContent = `Eine Fehler ist aufgetreten. Probieren Sie bitte noch einmal mit
             PDF Dateien welche nicht größer sind als 3 Megabyte.`
            setTimeout(() => window.location.href = event.target.dataset.redirectUrl, 4000)
        }
        container.querySelector(".modal-body").innerHTML = null
        container.querySelector(".modal-body").append(info)
    })

    response.catch(() => {
        event.target.classList.remove("disabled", "not-allowed")
        event.target.getElementsByClassName('spinner-border')[0]
            .setAttribute("hidden", "hidden")
        httpError(response)
    })
}

function onClickBtnDeleteDocument(id) {
    const confirmDialog = $(`#${id}`)
    const buttonsDelete = document.getElementsByClassName('delete-document')
    for (const buttonDelete of buttonsDelete) {
        if (buttonDelete.classList.contains('disabled')) {
            buttonDelete.addEventListener('click', event => event.preventDefault())
            continue
        }
        buttonDelete.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()

            if (event.target.classList.contains('disabled')) {
                return;
            }

            confirmDialog.modal({keyboard: false, backdrop: 'static'})

            confirmDialog.find('button[type=submit]').on('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                window.location.href = buttonDelete.href
            })
        })
    }
}

function showDocument() {
    const showDocumentButtons = document.getElementsByClassName('btn-show-document')
    const modal = $('#documentShow')
    for (const button of showDocumentButtons) {

        button.addEventListener('click', (event) => {
            event.stopPropagation()
            event.preventDefault()
            const src = event.currentTarget.dataset.url
            modal.on('hide.bs.modal', (e) => {
                $(e.target).find('object').removeAttr('data')
                $(e.target).find('object').attr('hidden')
                $(e.target).find('embed').removeAttr('src')
                $(e.target).find('embed').attr('hidden')
            })
            modal.on('hidden.bs.modal', (e) => {
                const spinner = $(e.target).find('.spinner-border')
                spinner.removeAttr("hidden" )
            })
            modal.on('show.bs.modal', (e) => {
                const spinner = $(e.target).find('.spinner-border')
                spinner.removeAttr("hidden" )
            })
            modal.on('shown.bs.modal', (e) => {
                const spinner = $(e.target).find('.spinner-border')
                $(e.target).find('object').attr('data', src)
                $(e.target).find('embed').attr('src', src)
                spinner.attr("hidden", "hidden")
                $(e.target).find('object').removeAttr('hidden')
                $(e.target).find('embed').removeAttr('hidden')
            })
            modal.modal({backdrop: 'static'})
        })
    }
}

function onClickBtnWorkflowStart() {
    const form = document.getElementById('workflowStartForm')

    if (form.checkValidity() === false) {
        form.classList.add('was-validated')
        return
    }

    const selectedRecipients = document.getElementById('selectedRecipients')
    const recipientsOptions = selectedRecipients.getElementsByTagName('option')
    const formData = new FormData(form);
    let data = Object.fromEntries(formData)
    data.recipients = []
    for (const option of recipientsOptions) {
        data.recipients.push(option.value)
    }

    const response = postData(form.action, data)
    response.then((response) => {
        if (response.ok && response.status === 201) {

            response.json().then((json) => {
                const nextAction = `${window.location.protocol}//${window.location.host}${json.nextAction}`
                window.history.replaceState({}, '', nextAction)
                window.location.replace(json.nextAction)
            })
        }
        if (response.status === 400) {
            response.json().then((response) => {
                if (response.field === 'inTrayRecipient') {
                    const inTrayRecipient = document.getElementById("inTrayRecipientAutoSuggesting")
                    const callback = () => {
                        form.classList.remove('was-validated')
                        inTrayRecipientHidden.removeAttribute("required")
                        inTrayRecipient.removeAttribute("style")
                    }
                    inTrayRecipient.addEventListener("input", callback);
                    const inTrayRecipientHidden = document.getElementById("inTrayRecipientHidden")
                    inTrayRecipientHidden.setAttribute("required", "required")

                    if (form.checkValidity() === false) {
                        form.classList.add('was-validated')
                        inTrayRecipient.setAttribute("style", "border-color: #dc3545 !important;")

                    }
                }

                console.log("Response data", response)
            });
        }
    });
    response.catch(() => {
        throw new Error(`Bitte wenden Sie sich an Ihren Administrator.`)
    })
}

function onSelectWorkflowType() {
    const form = document.getElementById('workflowStartForm')

    for (const workflowType of form.elements['workflowType']) {
        workflowType.addEventListener('change', () => {
            form.elements['workflowTypeValidation'].value = form.elements['workflowType'].value
        })
    }
}

function onSelectCategoryInTrayRecipient() {
    const form = document.getElementById('workflowStartForm')

    form.elements['selectCategory'].addEventListener('change', (event) => {
        const selected = form.elements['selectCategory'].item(event.target.selectedIndex)
        const inTray = document.getElementById("inTrayRecipientAutoSuggesting")
        const inTrayInternal = document.getElementById("inTrayRecipientHidden")
        form.classList.remove('was-validated')
        inTray.setAttribute("style", "")
        inTrayInternal.removeAttribute("required")
        
        if (typeof selected.dataset.inTray !== "undefined") {
            inTray.setAttribute("disabled", "disabled")
            inTray.value = selected.dataset.label
        } else {
            inTray.removeAttribute("disabled")
            inTray.value = ""
        }
    })
}

function onModalDialogConfirm(modalDialogId) {
    const modal = $(`#${modalDialogId}`)

    modal.find('button[type=submit]').on('click', (event) => {
        event.preventDefault()
        if (modal.parent().length !== 0 && modal.parent()[0].tagName.toLowerCase() === 'form') {
            const formElement = modal.parent()[0]

            if (formElement.checkValidity() === false) {
                formElement.classList.add('was-validated')
                return
            }

            const formData = new FormData(formElement)
            formData.append('operation', modalDialogId)
            const response = postData(formElement.action, formData)
            response.then((response) => {
                if (response.ok && response.status === 204) {
                    modal.find('.modal-body').html("<div class='alert alert-success'>Aufgabe ist hiermit erledigt.</div>")
                    modal.find('.modal-footer').html("")
                    setTimeout(() => window.location.href = '/', 1777)
                } else {
                    response.json().then((response) => console.log(response))
                }
            })

            response.catch((response) => httpError(response))
        }
    })
    modal.modal({
        keyboard: false,
        backdrop: 'static'
    })
}

(function () {
    'use strict';
    window.addEventListener('load', function () {
        const navLinks = document.getElementsByClassName('nav-link');
        for (let navLink of navLinks) {
            $(navLink).parent().removeClass('active');
            if (navLink.href === window.location.href) {
                $(navLink).parent().addClass('active');
            }
        }

        const scrollToTopButton = document.getElementById('js-top');
        const scrollFunc = () => {
            let y = window.scrollY;
            if (y > 0) {
                scrollToTopButton.className = "top-link show";
            } else {
                scrollToTopButton.className = "top-link hide";
            }
        };

        window.addEventListener("scroll", scrollFunc);
        const scrollToTop = () => {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, c - c / 10);
            }
        };

        scrollToTopButton.onclick = (e) => {
            e.preventDefault();
            scrollToTop();
        }
    })
})();
