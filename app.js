"use strict";

var dimensions = {
    width: 800,
    height: 600
};

var draw = SVG('app').size(dimensions.width, dimensions.height);
draw.viewbox(0.0, 0.0, dimensions.width, dimensions.height);

var background = draw.group();
background.add(draw.rect(dimensions.width, dimensions.height).fill('#303030'));
background.add(draw.circle(50).x(150.0).y(150.0).fill('#a0a0a0'));
background.add(draw.circle(20).x(450.0).y(250.0).fill('#a0a0a0'));
background.add(draw.circle(70).x(200.0).y(500.0).fill('#f1948a'));

var rocket_dimensions = {
    width: 10,
    height: 30
};

var rocket = draw.rect(rocket_dimensions.width, rocket_dimensions.height);
rocket.x(0.5 * (dimensions.width - rocket_dimensions.width));
rocket.y(0.5 * (dimensions.height - rocket_dimensions.height));
rocket.fill('#aed6f1');
var fire = draw.rect(0.5 * rocket_dimensions.width, 0.5 * rocket_dimensions.height);
fire.x(0.5 * (dimensions.width - 0.5 * rocket_dimensions.width));
fire.y(0.5 * (dimensions.height + rocket_dimensions.height));
fire.fill('#00000000');

var coordinates = {
    vx: 0.0,
    vy: 0.0,
    distance_x: 0.0,
    distance_y: 0.0,
    angle: 0.0
};

// update is called on every animation step
function update(dt) {
    var dx = coordinates.vx * dt;
    var dy = coordinates.vy * dt;
    coordinates.distance_x += dx;
    coordinates.distance_y += dy;
    background.dmove(-dx, -dy);
    background.rotate(-coordinates.angle, 0.5 * dimensions.width + coordinates.distance_x,
        0.5 * dimensions.height + coordinates.distance_y);
}

var last_time;
var frame;

function callback(timestamp_ms) {
    if (last_time) {
        update((timestamp_ms - last_time) / 1000.0)
    }
    last_time = timestamp_ms
    frame = requestAnimationFrame(callback)
}
callback()

SVG.on(document, 'keydown', function(e) {

    // left
    if (e.keyCode == 37) coordinates.angle -= 1.0;

    // right
    if (e.keyCode == 39) coordinates.angle += 1.0;

    // up -> burn the fuel
    if (e.keyCode == 38) {
        fire.fill('#f39c12');

        coordinates.angle = coordinates.angle % 360.0;
        var angle_rad = 2.0 * Math.PI * coordinates.angle / 360.0;
        var cos = Math.cos(angle_rad);
        var sin = Math.sin(angle_rad);
        var a = 5.0;
        coordinates.vx += sin * a;
        coordinates.vy -= cos * a;
    }

    e.preventDefault();
})

SVG.on(document, 'keyup', function(e) {
    fire.fill('#00000000');
    e.preventDefault();
})
