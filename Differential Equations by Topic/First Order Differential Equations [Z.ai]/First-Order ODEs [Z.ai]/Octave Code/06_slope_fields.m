% ═══════════════════════════════════════════════════════════════════
% Plotting Slope Fields and Solution Curves
% ═══════════════════════════════════════════════════════════════════
%
% This script draws a slope field (direction field) for a first-order
% ODE and overlays several solution curves.
%
% Example: dy/dx = sin(x*y)

clear; clc; close all;

% ── Define the ODE ──
f = @(x, y) sin(x .* y);

% ── Create a grid of points ──
x_range = linspace(0, 3, 20);
y_range = linspace(-2, 4, 20);
[X, Y] = meshgrid(x_range, y_range);

% ── Compute slopes at each grid point ──
DY = f(X, Y);
DX = ones(size(DY));

% ── Normalize arrow lengths for uniform appearance ──
L = sqrt(DX.^2 + DY.^2);
DX_norm = DX ./ L;
DY_norm = DY ./ L;

% ── Plot the slope field ──
figure(1); clf;
quiver(X, Y, DX_norm, DY_norm, 0.5, 'Color', [0.5, 0.5, 0.5], 'LineWidth', 1);
hold on;

% ── Overlay solution curves using ode45 ──
% Try several initial conditions to see how solutions flow
initial_ys = [-1, 0, 1, 2, 3];
colors = lines(length(initial_ys));

for i = 1:length(initial_ys)
    [x_sol, y_sol] = ode45(f, [0, 3], initial_ys(i));
    plot(x_sol, y_sol, 'Color', colors(i,:), 'LineWidth', 2);
end

title('Slope field and solution curves for dy/dx = sin(xy)');
xlabel('x'); ylabel('y');
xlim([0, 3]); ylim([-2, 4]);
grid on;
legend('Slope field', 'y(0)=-1', 'y(0)=0', 'y(0)=1', 'y(0)=2', 'y(0)=3', ...
       'Location', 'best');

% ── Another example: dy/dx = y (exponential growth) ──
figure(2); clf;
f2 = @(x, y) y;
[X2, Y2] = meshgrid(linspace(-1, 2, 20), linspace(-3, 5, 20));
DY2 = f2(X2, Y2);
DX2 = ones(size(DY2));
L2 = sqrt(DX2.^2 + DY2.^2);
quiver(X2, Y2, DX2./L2, DY2./L2, 0.5, 'Color', [0.5,0.5,0.5], 'LineWidth', 1);
hold on;
for y0 = [-2, -1, 0.5, 1, 2]
    [xs, ys] = ode45(f2, [-1, 2], y0);
    plot(xs, ys, 'b-', 'LineWidth', 2);
end
title('Slope field for dy/dx = y (unstable equilibrium at y = 0)');
xlabel('x'); ylabel('y');
grid on;
