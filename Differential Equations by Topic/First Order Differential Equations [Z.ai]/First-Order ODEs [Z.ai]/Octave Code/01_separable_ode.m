% ═══════════════════════════════════════════════════════════════════
% Symbolic ODE Solving — Separation of Variables
% ═══════════════════════════════════════════════════════════════════
%
% Problem:  dy/dx = 2*x*y,  y(0) = 1
% Exact solution: y = e^(x^2)
%
% This script shows how to solve a separable ODE symbolically
% using Octave's symbolic package (dsolve equivalent).

pkg load symbolic

% ── Define symbolic variables ──
syms y(x) x C

% ── Define the ODE ──
% dy/dx = 2*x*y
ode = diff(y, x) == 2*x*y;

% ── Define the initial condition ──
cond = y(0) == 1;

% ── Solve analytically ──
sol = dsolve(ode, cond);
disp('General solution with IC:');
disp(sol);

% ── Simplify ──
sol_simplified = simplify(sol);
disp('Simplified:');
disp(sol_simplified);

% ── Verify by substitution ──
% Compute dy/dx from the solution and check it equals 2*x*y
dydx = diff(sol, x);
check = simplify(dydx - 2*x*subs(sol, x));
disp('Verification (should be 0):');
disp(check);

% ── Plot the solution ──
figure(1); clf;
fplot(sol, [0, 2], 'b-', 'LineWidth', 2);
hold on;
fplot(@(x) exp(x.^2), [0, 2], 'r--', 'LineWidth', 1.5);
title('Separable ODE: dy/dx = 2xy, y(0) = 1');
xlabel('x'); ylabel('y');
legend('Symbolic solution', 'e^{x^2} (verification)', 'Location', 'northwest');
grid on;

% ── Evaluate at specific points ──
x_vals = [0, 0.5, 1.0, 1.5, 2.0];
for i = 1:length(x_vals)
    y_val = double(subs(sol, x, x_vals(i)));
    fprintf('y(%.1f) = %.6f\n', x_vals(i), y_val);
end
