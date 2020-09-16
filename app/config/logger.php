<?php

declare(strict_types=1);

$default = [];

$envSpecificConfig = __DIR__ . '/logger.' . APP_ENV . '.php';

return is_file($envSpecificConfig) ? array_replace_recursive($default, include $envSpecificConfig) : $default;
