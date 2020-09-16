# Defined in - @ line 0
function dcl --description 'alias dclean=docker system prune --all --volumes --force'
	docker system prune --all --volumes --force $argv;
end
