<?php

declare(strict_types=1);

use Aidphp\Http\Emitter;
use Aidphp\Http\ServerRequestFactory;
use Dice\Dice;
use FastRoute\Dispatcher;
use Interop\Http\EmitterInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\PhpRenderer;
use Waglpz\View\Helpers\Factory\Factory as ViewHelpersFactory;
use Waglpz\Webapp\Security\Firewalled;
use Waglpz\Webapp\UI\Http\Web\SwaggerUI;

use function FastRoute\simpleDispatcher;
use function Waglpz\Webapp\config;

return [
    '*'                            => [
        'substitutions' => [
            Dispatcher::class                => [
                Dice::INSTANCE => static function (): Dispatcher {
                    return simpleDispatcher(config('router'));
                },
            ],
            Firewalled::class                => null,
            PhpRenderer::class               => '$DefaultViewRenderer',
            EmitterInterface::class          => Emitter::class,
        ],
    ],
    //-> Web App
    ServerRequestInterface::class  => [
        'shared'     => true,
        'instanceOf' => ServerRequestFactory::class,
        'call'       => [['createServerRequestFromGlobals', [], Dice::CHAIN_CALL]],
    ],
    '$DefaultViewRenderer'         => [
        'shared'          => true,
        'instanceOf'      => PhpRenderer::class,
        'constructParams' => [
            config('view')['templates'],
            config('view')['attributes'],
            config('view')['layout'],
        ],
    ],
    ViewHelpersFactory::class      => [
        'shared'          => true,
        'instanceOf'      => ViewHelpersFactory::class,
        'constructParams' => [config('viewHelpers')],
    ],
    SwaggerUI::class                 => [
        'shared'          => true,
        'constructParams' => [config('swagger_scheme_file')],
    ],
    //<- Web App
];
