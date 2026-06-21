% ═══════════════════════════════════════════════════════════════════
% Symbolic ODE Solving — Non-Exact with Integrating Factor
% ═══════════════════════════════════════════════════════════════════
%
% Problem:  (2*x^2 - y)*dx + (x^2*y + x)*dy = 0
% Not exact. Find integrating factor mu(x), then solve.
% Solution: 2*x + y/x + y^2/2 = C
%
% This script demonstrates:
%   1. Testing for exactness (fails)
%   2. Computing (M_y - N_x)/N to find an x-only IF
%   3. Multiplying by mu and solving as exact

pkg load symbolic

syms x y

% ── Define M and N ──
M = 2*x^2 - y;
N = x^2*y + x;

% ── Step 1: Test exactness ──
M_y = diff(M, y);
N_x = diff(N, x);
fprintf('M_y = %s,  N_x = %s\n', char(M_y), char(N_x));

if simplify(M_y - N_x) == 0
    disp('Already exact — no IF needed.');
    return;
end
disp('Not exact. Finding integrating factor...');

% ── Step 2: Test for x-only IF: (M_y - N_x) / N ──
test_x = simplify((M_y - N_x) / N);
fprintf('(M_y - N_x)/N = %s\n', char(test_x));

% Check if this is a function of x only (no y)
if isempty(symvar(test_x)) || all(arrayfun(@(v) v ~= y, symvar(test_x)))
    f_x = test_x;
    fprintf('f(x) = %s  (function of x only!)\n', char(f_x));
    mu = exp(int(f_x, x));
    fprintf('Integrating factor mu(x) = %s\n', char(mu));
else
    disp('(M_y - N_x)/N depends on y. Try y-only test.');
    test_y = simplify((N_x - M_y) / M);
    fprintf('(N_x - M_y)/M = %s\n', char(test_y));
    g_y = test_y;
    mu = exp(int(g_y, y));
    fprintf('Integrating factor mu(y) = %s\n', char(mu));
end

% ── Step 3: Multiply original equation by mu ──
M_new = simplify(M * mu);
N_new = simplify(N * mu);
fprintf('New M* = %s\n', char(M_new));
fprintf('New N* = %s\n', char(N_new));

% Verify new equation is exact
M_new_y = diff(M_new, y);
N_new_x = diff(N_new, x);
fprintf('M*_y = %s,  N*_x = %s\n', char(simplify(M_new_y)), char(simplify(N_new_x)));

% ── Step 4: Find the potential F ──
F_partial = int(M_new, x);
g_prime = simplify(N_new - diff(F_partial, y));
g = int(g_prime, y);
F = simplify(F_partial + g);
fprintf('Potential F(x,y) = %s\n', char(F));
fprintf('Solution: %s = C\n', char(F));

% ── Plot level curves ──
figure(1); clf;
[X, Y] = meshgrid(linspace(0.1, 3, 100), linspace(-2, 4, 100));
F_vals = double(subs(F, {x, y}, {X, Y}));
contour(X, Y, F_vals, 20);
title('Non-exact ODE (with IF): level curves of F = C');
xlabel('x'); ylabel('y');
colorbar;
grid on;
