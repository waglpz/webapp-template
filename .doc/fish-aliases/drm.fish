# Defined in - @ line 1
function drm --wraps=docker\ ps\ -aq\ \|\ tee\ \|\ xargs\ docker\ stop\ \|\ xargs\ docker\ rm\ \&\&\ docker\ network\ ls\ \|\ tee\ \|\ awk\ \'\{print\ \$2\}\'\ \|\ grep\ -v\ ID\ \|\ grep\ -v\ none\ \|\ grep\ -v\ host\ \|\ grep\ -v\ bridge\ \|\ tee\ 0\|\ xargs\ docker\ network\ rm --description alias\ drm=docker\ ps\ -aq\ \|\ tee\ \|\ xargs\ docker\ stop\ \|\ xargs\ docker\ rm\ \&\&\ docker\ network\ ls\ \|\ tee\ \|\ awk\ \'\{print\ \$2\}\'\ \|\ grep\ -v\ ID\ \|\ grep\ -v\ none\ \|\ grep\ -v\ host\ \|\ grep\ -v\ bridge\ \|\ tee\ 0\|\ xargs\ docker\ network\ rm
  docker ps -aq | tee | xargs docker stop | xargs docker rm && docker network ls | tee | awk '{print $2}' | grep -v ID | grep -v none | grep -v host | grep -v bridge | tee 0| xargs docker network rm $argv;
end
