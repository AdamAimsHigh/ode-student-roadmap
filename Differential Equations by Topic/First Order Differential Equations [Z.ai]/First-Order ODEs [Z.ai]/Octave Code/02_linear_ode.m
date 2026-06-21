% ═══════════════════════════════════════════════════════════════════
% Symbolic ODE Solving — Linear First-Order ODE
% ═══════════════════════════════════════════════════════════════════
%
% Problem:  dy/dx + (2/x)*y = 4*x^2,  y(1) = 2
% Exact solution: y = (2/3)*x^4 + 4/(3*x^2)
%
% This script solves a linear first-order ODE using the
% integrating factor method, verified symbolically.

pkg load symbolic

syms y(x) x

% ── Define the ODE in standard form ──
% y' + P(x)*y = Q(x)
% P(x) = 2/x,  Q(x) = 4*x^2
ode = diff(y, x) + (2/x)*y == 4*x^2;
cond = y(1) == 2;

% ── Solve ──
sol = dsolve(ode, cond);
disp('Solution:');
disp(simplify(sol));

% ── Compute the integrating factor manually (for teaching) ──
P = 2/x;
mu = exp(int(P, x));
disp('Integrating factor mu(x):');
disp(mu);

% ── Verify by substitution ──
dydx = diff(sol, x);
lhs = dydx + (2/x)*sol;
rhs = 4*x^2;
check = simplify(lhs - rhs);
disp('Verification (should be 0):');
disp(check);

% ── Plot ──
figure(1); clf;
fplot(sol, [0.5, 3], 'b-', 'LineWidth', 2);
title('Linear ODE: y'' + (2/x)y = 4x^2, y(1) = 2');
xlabel('x'); ylabel('y');
grid on;

% ── Evaluate at specific points ──
for xv = [1, 1.5, 2, 2.5, 3]
    yv = double(subs(sol, x, xv));
    fprintf('y(%.1f) = %.6f\n', xv, yv);
end
