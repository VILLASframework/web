# To-Do
 - Change password
 - Move plot attributes/styling from plot-container into actual plots
 - Move drag-n-drop to mixins
 - Go into edit mode if visualization is empty
 - Auto-detect if simulators are running
 - Remove running socket if it's not in the updated list
 - Rebrand plots into widgets
 - Change widget model (plot) to custom data to provide mechanism for all widgets
 - Add widgets where dropped

websocketserverip/config.json
{
    "affinity": 1,
    "debug": 5,
    "stats": 3,
    "name": "villas-acs",
    "http": {
        "htdocs": "/villas/web/socket",
        "port": 80
    },
    "plugins": [
        "simple_circuit.so",
        "example_hook.so"
    ],
    "nodes": {
        "ws": {
            "type": "websocket",
            "unit": "MVa",
            "units": [
                "V",
                "A",
                "Var"
            ],
            "description": "Demo Channel",
            "source": {
                "simulator": "OP5600",
                "location": "ACS lab"
            },
            "series": [
                {
                    "label": "Random walk"
                },
                {
                    "label": "Sine"
                },
                {
                    "label": "Rect"
                }
            ]
        }
    },
    "paths": [
        {
            "in": "ws",
            "out": "ws"
        }
    ]
}


websocketserverip/nodes.json:
[
    {
        "name": "ws",
        "connections": 1,
        "state": 3,
        "vectorize": 1,
        "affinity": 1,
        "type": "websocket",
        "unit": "MVa",
        "units": [
            "V",
            "A",
            "Var"
        ],
        "description": "Demo Channel",
        "source": {
            "simulator": "OP5600",
            "location": "ACS lab"
        },
        "series": [
            {
                "label": "Random walk"
            },
            {
                "label": "Sine"
            },
            {
                "label": "Rect"
            }
        ]
    }
]
