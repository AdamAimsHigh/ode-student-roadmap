% ═══════════════════════════════════════════════════════════════════
% Numerical ODE Solving — Euler, Heun, RK4
% ═══════════════════════════════════════════════════════════════════
%
% Problem:  dy/dx = x + y,  y(0) = 1
% Exact solution: y = 2*e^x - x - 1
%
% This script implements all three numerical methods from scratch
% and compares them to the exact solution.

clear; clc; close all;

% ── Problem setup ──
f = @(x, y) x + y;           % dy/dx = x + y
x0 = 0;  y0 = 1;              % initial condition
x_end = 0.3;                  % target x
h = 0.1;                      % step size
n_steps = round((x_end - x0) / h);

% ── Exact solution (for comparison) ──
y_exact = @(x) 2*exp(x) - x - 1;

% ═══════════════════════════════════════════════════════════════
% METHOD 1: EULER'S METHOD
%   y_{n+1} = y_n + h * f(x_n, y_n)
%   Local error: O(h^2), Global error: O(h)
% ═══════════════════════════════════════════════════════════════
x_euler = x0;  y_euler = y0;
for i = 1:n_steps
    y_euler(i+1) = y_euler(i) + h * f(x_euler(i), y_euler(i));
    x_euler(i+1) = x_euler(i) + h;
end

% ═══════════════════════════════════════════════════════════════
% METHOD 2: HEUN'S METHOD (Improved Euler / Predictor-Corrector)
%   Predict: y_tilde = y_n + h * f(x_n, y_n)
%   Correct: y_{n+1} = y_n + (h/2) * [f(x_n,y_n) + f(x_{n+1}, y_tilde)]
%   Local error: O(h^3), Global error: O(h^2)
% ═══════════════════════════════════════════════════════════════
x_heun = x0;  y_heun = y0;
for i = 1:n_steps
    y_pred = y_heun(i) + h * f(x_heun(i), y_heun(i));       % predictor
    y_heun(i+1) = y_heun(i) + (h/2) * (...
        f(x_heun(i), y_heun(i)) + ...
        f(x_heun(i) + h, y_pred));                            % corrector
    x_heun(i+1) = x_heun(i) + h;
end

% ═══════════════════════════════════════════════════════════════
% METHOD 3: RK4 (Classical Runge-Kutta)
%   k1 = f(x_n, y_n)
%   k2 = f(x_n + h/2, y_n + h/2 * k1)
%   k3 = f(x_n + h/2, y_n + h/2 * k2)
%   k4 = f(x_n + h, y_n + h * k3)
%   y_{n+1} = y_n + (h/6) * (k1 + 2*k2 + 2*k3 + k4)
%   Local error: O(h^5), Global error: O(h^4)
% ═══════════════════════════════════════════════════════════════
x_rk4 = x0;  y_rk4 = y0;
for i = 1:n_steps
    k1 = f(x_rk4(i), y_rk4(i));
    k2 = f(x_rk4(i) + h/2, y_rk4(i) + h/2 * k1);
    k3 = f(x_rk4(i) + h/2, y_rk4(i) + h/2 * k2);
    k4 = f(x_rk4(i) + h, y_rk4(i) + h * k3);
    y_rk4(i+1) = y_rk4(i) + (h/6) * (k1 + 2*k2 + 2*k3 + k4);
    x_rk4(i+1) = x_rk4(i) + h;
end

% ═══════════════════════════════════════════════════════════════
% COMPARISON TABLE
% ═══════════════════════════════════════════════════════════════
fprintf('\n');
fprintf('%-6s  %10s  %10s  %10s  %10s\n', 'x', 'Euler', 'Heun', 'RK4', 'Exact');
fprintf('%-6s  %10s  %10s  %10s  %10s\n', '------', '----------', '----------', '----------', '----------');
for i = 1:length(x_euler)
    ye = y_exact(x_euler(i));
    fprintf('%-6.1f  %10.4f  %10.4f  %10.4f  %10.4f\n', ...
        x_euler(i), y_euler(i), y_heun(i), y_rk4(i), ye);
end

fprintf('\nError at x = %.1f:\n', x_end);
fprintf('  Euler: |%.4f - %.4f| = %.4f (%.2f%%)\n', ...
    y_euler(end), y_exact(x_end), abs(y_euler(end)-y_exact(x_end)), ...
    100*abs(y_euler(end)-y_exact(x_end))/y_exact(x_end));
fprintf('  Heun:  |%.4f - %.4f| = %.4f (%.2f%%)\n', ...
    y_heun(end), y_exact(x_end), abs(y_heun(end)-y_exact(x_end)), ...
    100*abs(y_heun(end)-y_exact(x_end))/y_exact(x_end));
fprintf('  RK4:   |%.4f - %.4f| = %.4f (%.2f%%)\n', ...
    y_rk4(end), y_exact(x_end), abs(y_rk4(end)-y_exact(x_end)), ...
    100*abs(y_rk4(end)-y_exact(x_end))/y_exact(x_end));

% ═══════════════════════════════════════════════════════════════
% PLOT
% ═══════════════════════════════════════════════════════════════
figure(1); clf;
x_fine = linspace(0, x_end, 100);
plot(x_fine, y_exact(x_fine), 'k-', 'LineWidth', 2); hold on;
plot(x_euler, y_euler, 'ro-', 'LineWidth', 1.5, 'MarkerSize', 8);
plot(x_heun, y_heun, 'gs-', 'LineWidth', 1.5, 'MarkerSize', 8);
plot(x_rk4, y_rk4, 'b^-', 'LineWidth', 1.5, 'MarkerSize', 8);
title(sprintf('Numerical Methods Comparison (h = %.1f)', h));
xlabel('x'); ylabel('y');
legend('Exact (2e^x - x - 1)', 'Euler', 'Heun', 'RK4', 'Location', 'northwest');
grid on;

% ═══════════════════════════════════════════════════════════════
% BONUS: Using Octave's built-in ode45 (adaptive RK4/5)
% ═══════════════════════════════════════════════════════════════
% ode45 is the industry-standard ODE solver. It automatically
% adjusts the step size to maintain a specified tolerance.
[x_ode45, y_ode45] = ode45(f, [0, x_end], 1);
fprintf('\node45 (Octave built-in, adaptive RK4/5):\n');
fprintf('  y(%.1f) = %.6f\n', x_end, y_ode45(end));
