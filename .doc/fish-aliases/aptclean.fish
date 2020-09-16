# Defined in - @ line 0
function aptclean --description 'alias aptclean=sudo apt update -y ; sudo apt upgrade ; sudo apt autoremove ; sudo apt autoclean ; sudo apt clean'
	sudo apt update -y ; sudo apt upgrade ; sudo apt autoremove ; sudo apt autoclean ; sudo apt clean $argv;
end
