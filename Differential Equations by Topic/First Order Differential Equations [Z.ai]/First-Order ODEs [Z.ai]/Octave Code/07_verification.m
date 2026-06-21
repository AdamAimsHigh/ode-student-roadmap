% ═══════════════════════════════════════════════════════════════════
% Verification: Symbolic Back-Substitution
% ═══════════════════════════════════════════════════════════════════
%
% This script shows how to verify an analytical solution by
% substituting it back into the original ODE.
%
% Example: Verify that y = (2/3)x^4 + 4/(3x^2) solves
%   x*dy/dx + 2*y = 4*x^3

pkg load symbolic

syms x

% ── Proposed solution ──
y_sol = (2/3)*x^4 + 4/(3*x^2);
fprintf('Proposed solution: y = %s\n', char(y_sol));

% ── Compute dy/dx ──
dy_dx = diff(y_sol, x);
fprintf('dy/dx = %s\n', char(dy_dx));

% ── Substitute into the left-hand side of the ODE ──
lhs = x * dy_dx + 2 * y_sol;
lhs_simplified = simplify(lhs);
fprintf('LHS (x*dy/dx + 2*y) = %s\n', char(lhs_simplified));

% ── The right-hand side ──
rhs = 4 * x^3;
fprintf('RHS (4*x^3) = %s\n', char(rhs));

% ── Check ──
if simplify(lhs_simplified - rhs) == 0
    disp('✓ VERIFIED: LHS = RHS. The solution is correct.');
else
    disp('✗ FAILED: LHS ≠ RHS. Check your solution.');
end

% ═══════════════════════════════════════════════════════════════
% Also verify the initial condition
% ═══════════════════════════════════════════════════════════════
y_at_1 = subs(y_sol, x, 1);
fprintf('\ny(1) = %s = %.4f\n', char(y_at_1), double(y_at_1));
if double(y_at_1) == 2
    disp('✓ Initial condition y(1) = 2 satisfied.');
end

% ═══════════════════════════════════════════════════════════════
% Compare numerical vs analytical solutions
% ═══════════════════════════════════════════════════════════════
fprintf('\n--- Numerical vs Analytical Comparison ---\n');
f = @(x, y) 4*x^2 - 2*y/x;  % rearranged: dy/dx = (4x^3 - 2y)/x
[x_num, y_num] = ode45(f, [1, 3], 2);

fprintf('%-6s  %12s  %12s  %12s\n', 'x', 'Numerical', 'Analytical', 'Error');
for i = 1:5:length(x_num)
    x_val = x_num(i);
    y_analytical = double(subs(y_sol, x, x_val));
    err = abs(y_num(i) - y_analytical);
    fprintf('%-6.2f  %12.6f  %12.6f  %12.2e\n', x_val, y_num(i), y_analytical, err);
end

% Plot both
figure(1); clf;
plot(x_num, y_num, 'b-', 'LineWidth', 2); hold on;
fplot(y_sol, [1, 3], 'r--', 'LineWidth', 1.5);
title('Verification: Numerical (ode45) vs Analytical');
xlabel('x'); ylabel('y');
legend('ode45 (numerical)', 'Analytical (symbolic)', 'Location', 'northwest');
grid on;
