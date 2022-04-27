/**
 * see https://github.com/fitiskin/jquery-autocompleter
 * @param dataSource url to th service that returns json array with te emails in form
 *  [
 *     {value: 'name@veolia.com', label: 'name@veolia.com'},
 *  ]
 *
 */
function onSelectRecipients(dataSource) {
    const recipients = document.getElementById('selectedRecipients')
    const recipientsPreview = document.getElementById('selectedRecipientsPreview')
    const autoSuggestInput = $('#recipientsAutoSuggesting');
    autoSuggestInput.autocompleter({
        minLength: 3,
        delay: 100,
        //hint: true,
        empty: false,
        source: dataSource,
        limit: 5,
        cache: true,
        cacheExpires: 5,
        // focusOpen: true,
        // changeWhenSelect: false,
        // selectFirst: false,
        highlightMatches: true,
        combine: function (params) {
            return {
                "filter[mail]": `${params.query}`,
                limit: params.limit,
            };
        },
        callback: function (value, index, object) {

            const option = document.createElement('option')
            const div = document.createElement('div')
            div.addEventListener('click', (event) => {
                event.stopPropagation()
                option.parentNode.removeChild(option)
                div.parentNode.removeChild(div)
            })
            div.classList.add('m-1')
            div.classList.add('alert')
            div.classList.add('alert-primary')
            div.classList.add('p-0')
            div.classList.add('px-2')
            div.classList.add('hide')
            div.innerHTML = `<div class="text-nowrap">
<div class="pt-2 d-inline-block text-nowrap text-truncate" style="width: 97%">${object.value}
</div><span class="close">&times;</span>&nbsp;</div>`
            option.value = object.value
            option.selected = true
            option.innerHTML = object.value
            recipients.appendChild(option)
            recipientsPreview.appendChild(div)
            div.classList.add('show')
            div.classList.add('fade')
            autoSuggestInput.val(null)
        }
    });
}

/**
 * see https://github.com/fitiskin/jquery-autocompleter
 * @param dataSource url to th service that returns json array with te emails in form
 *  [
 *     {value: 'name@veolia.com', label: 'name@veolia.com'},
 *  ]
 *
 */
function onSelectInTrayRecipient(dataSource) {
    const autoSuggestInput = $('#inTrayRecipientAutoSuggesting');
    autoSuggestInput.autocompleter({
        minLength: 3,
        delay: 100,
        //hint: true,
        empty: false,
        source: dataSource,
        limit: 5,
        cache: true,
        cacheExpires: 5,
        // focusOpen: true,
        // changeWhenSelect: false,
        // selectFirst: false,
        highlightMatches: true,
        combine: function (params) {
            return {
                "filter[mail]": `${params.query}`,
                limit: params.limit,
            };
        },
        callback: function () {
            const div = document.createElement('div')
            autoSuggestInput.after(div)
            div.addEventListener('click', (event) => {
                event.stopPropagation()
                autoSuggestInput.val(null)
                div.remove()
            })
            div.innerHTML = `<span class="close mt-1 inTrayRecipientDeleteBtn" title="Löschen" >&times;</span>`
        }
    });
}
