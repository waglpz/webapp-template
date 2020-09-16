# Defined in - @ line 1
function dlog --description 'alias dlogs=docker-compose logs --tail 10 -f'
	docker-compose logs --tail 10 -f $argv;
end
