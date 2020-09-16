<?php

declare(strict_types=1);

if (PHP_SAPI === 'cli') {
    $config = include __DIR__ . '/container/cli.rules.php';
} else {
    $config = include __DIR__ . '/container/web.rules.php';
}

$sharedConfig = include __DIR__ . '/container/shared.rules.php';

return array_replace_recursive($sharedConfig, $config);
