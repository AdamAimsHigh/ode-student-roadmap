% ═══════════════════════════════════════════════════════════════════
% Octave 11.3.0 GUI — Quick Start
% Staples Education — ODE Module
% ═══════════════════════════════════════════════════════════════════
%
% This script demonstrates the basic Octave GUI workflow:
%   1. Launching the GUI
%   2. Using the Command Window
%   3. Using the Editor
%   4. Running a script
%   5. Viewing plots
%
% ── GUI Layout ──
%   • Command Window (bottom-left): interactive REPL
%   • Workspace (top-left): variable explorer
%   • File Browser (left sidebar): navigate folders
%   • Editor (center): write and edit .m scripts
%   • Plot Window (separate): view figures
%
% ── Try these commands in the Command Window ──

% Basic arithmetic
3 + 4          % ans = 7
2^10           % ans = 1024
pi             % ans = 3.1416
exp(1)         % ans = 2.7183  (Euler's number e)

% Variables
x = 5           % assign
y = [1, 2, 3]  % row vector
z = 1:0.5:3    % [1, 1.5, 2, 2.5, 3]

% A simple plot
x = linspace(0, 2*pi, 100);
y = sin(x);
plot(x, y, 'b-', 'LineWidth', 2);
title('y = sin(x)');
xlabel('x'); ylabel('y');
grid on;

% ── Running a Script ──
%   1. Open the Editor (Ctrl+N for new file, or File > New > Script)
%   2. Type your code
%   3. Save as 'my_script.m' in your working directory
%   4. Run by pressing F5 or typing 'my_script' in the Command Window
%
% ── Loading the Symbolic Package ──
%   The symbolic package is needed for analytical ODE solving.
%   Install once:   pkg install -forge symbolic
%   Load each session:  pkg load symbolic

pkg load symbolic

% Verify symbolic is working
syms x y
f = x^2 + y^2
diff(f, x)     % ans = 2*x
int(f, x)      % ans = x^3/3 + x*y^2

disp('GUI basics demo complete. See the plot window.')
