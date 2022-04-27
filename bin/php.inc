<?php
$function = $_SERVER['argv'][1];

function slug($string)
{
    error_reporting(null);
    set_error_handler(static fn() => exit(1));
    $result = preg_replace('/-+/', '-', preg_replace('/[^a-zA-Z0-9]/', '-', $string));
    $result = strtolower($result);
    restore_error_handler();
    return $result;
}
function ns($string)
{
    error_reporting(null);
    set_error_handler(static fn() => exit(1));
    $result = str_replace('-', '', ucwords($string, '-'));
    restore_error_handler();
    return $result;
}

echo $function($_SERVER['argv'][2]);
