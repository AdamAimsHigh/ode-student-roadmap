% ═══════════════════════════════════════════════════════════════════
% Symbolic ODE Solving — Exact Equations
% ═══════════════════════════════════════════════════════════════════
%
% Problem:  (2*x*y + 3)*dx + (x^2 - 1)*dy = 0
% Exact solution: x^2*y + 3*x - y = C
%
% This script demonstrates:
%   1. Testing for exactness (M_y = N_x)
%   2. Finding the potential function F(x,y)
%   3. Verifying the solution

pkg load symbolic

syms x y

% ── Define M and N ──
M = 2*x*y + 3;   % coefficient of dx
N = x^2 - 1;     % coefficient of dy

% ── Step 1: Test for exactness ──
M_y = diff(M, y);
N_x = diff(N, x);
fprintf('M_y = %s\n', char(M_y));
fprintf('N_x = %s\n', char(N_x));

if simplify(M_y - N_x) == 0
    disp('Exact! M_y = N_x');
else
    disp('Not exact. Need an integrating factor.');
    return;
end

% ── Step 2: Find the potential F(x,y) ──
% F = integral of M with respect to x, plus g(y)
F_partial = int(M, x);
fprintf('F (after integrating M in x) = %s\n', char(F_partial));

% g'(y) = N - diff(F_partial, y)
g_prime = simplify(N - diff(F_partial, y));
fprintf('g''(y) = %s\n', char(g_prime));

g = int(g_prime, y);
fprintf('g(y) = %s\n', char(g));

F = F_partial + g;
fprintf('Potential F(x,y) = %s\n', char(F));

% ── Step 3: The general solution is F = C ──
disp('General solution: F(x,y) = C');
fprintf('  %s = C\n', char(F));

% ── Verify: dF should equal M dx + N dy ──
dF_dx = diff(F, x);
dF_dy = diff(F, y);
fprintf('Verification: dF/dx = %s (should be %s)\n', char(dF_dx), char(M));
fprintf('Verification: dF/dy = %s (should be %s)\n', char(dF_dy), char(N));

% ── Plot level curves of F (the solution family) ──
figure(1); clf;
[X, Y] = meshgrid(linspace(-2, 2, 100), linspace(-2, 2, 100));
F_vals = double(subs(F, {x, y}, {X, Y}));
contour(X, Y, F_vals, 20);
title('Exact equation: level curves of F(x,y) = C');
xlabel('x'); ylabel('y');
colorbar;
grid on;
