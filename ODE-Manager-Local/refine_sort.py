import pandas as pd
import re

# Load the raw extracted playlist
df = pd.read_csv('playlist_data.csv')

def bulletproof_pedagogical_sort(title):
    t = str(title).lower()
    
    # 16. Nonlinear Dynamics & Chaos
    if re.search(r'nonlinear|chaos|bifurcation|lyapunov|phase plane|phase portrait|nullcline|limit cycle|duffing|van der pol|linearization|linearize|phase diagram', t): return 16
    # 15. Fourier Series & PDEs
    if re.search(r'fourier|pde|heat|wave|separation of variable|partial diff|laplacian', t): return 15
    # 14. Boundary Value Problems & Orthogonal Functions
    if re.search(r'boundary value|bvp|sturm|liouville|orthogonal function|boundary condition', t): return 14
    
    # 13. Series Solutions (ADDED CHEBYSHEV, HERMITE, LAGUERRE)
    if re.search(r'series|frobenius|bessel|legendre|chebyshev|hermite|laguerre|power series|taylor series|taylor expansion|analytic', t): return 13
    
    # 12. Laplace Transforms
    if re.search(r'laplace|heaviside|dirac|delta function|step function|convolution|transfer function|pole diagram|frequency domain|control system', t): return 12

    # 11. Systems of ODEs & Fundamental Matrices
    if re.search(r'matrix exponential|fundamental matrix|fundamental matrices|coupled system|system of diff|systems of linear|trajectories|exp\(at\)|e\^{ta}|linear system', t): return 11
    # 10. Linear Algebra Pre-reqs & Matrix Operators
    if re.search(r'eigenvalue|eigenvector|diagonalization|linear algebra|matrix multiplication|determinant|trace|eigen|jacobian|vector field|operator|matrix', t): return 10

    # 9. Coupled Oscillators & Vibrations
    if re.search(r'oscillator|vibration|spring|mass|rlc|circuit|resonance|damping|harmonic|duhamel|forced damped|input|response|steady-state', t): return 9
    
    # 8. Solving 2nd Order Methods (ADDED CAUCHY AND EQUIDIMENSIONAL)
    if re.search(r'undetermined|variation of parameter|annihilator|constant coeff|second order linear|2nd order linear|characteristic eq|annihilates|higher order|high-order|higher-order|particular solution|reduction of order|cauchy|equidimensional', t): return 8
    
    # 7. 2nd Order Theory
    if re.search(r'wronskian|wronksian|superposition|linear independence|linear dependence|fundamental set|second order|2nd order|abel', t): return 7

    # 6. Numerical Methods
    if re.search(r'euler|heun|runge|rk4|numerical|isocline|approximation', t): return 6
    # 5. Qualitative Analysis & Stability
    if re.search(r'equilibrium|stability|logistic|phase line|autonomous|critical point|fixed point', t): return 5
    # 4. Applications & Modeling
    if re.search(r'cooling|mixing|tank|population|radioactive|decay|growth|newton\'s law|torricelli|brachistochrone|commodity|supply, demand|indifference curve|budget line', t): return 4
    
    # 3. 1st Order Analytical Methods (Clairaut is already safely handled here!)
    if re.search(r'separable|integrating factor|exact|homogeneous|bernoulli|first order|1st order|first-order|1st-order|substitution|partial derivative|chain rule|level curve|contour|clairaut|line integral|total differential|conservative field', t): return 3
    
    # 2. Rigorous Existence/Uniqueness
    if re.search(r'picard|banach|existence|uniqueness|theorem|lipschitz', t): return 2
    
    # 1. Catch-all for pure introductory resources
    if re.search(r'intro|slope field|direction field|what is|overview|tourist|definition|order|degree|linear vs|solution to a|dynamics', t): return 1
    
    # Fallback safety checks
    if 'system' in t: return 11
    if 'matrix' in t: return 10
    if 'partial' in t or 'curve' in t: return 3
    
    return 1

df['Pillar'] = df['Title'].apply(bulletproof_pedagogical_sort)
df = df.sort_values(by=['Pillar', 'Position']).reset_index(drop=True)
df['Position'] = df.index
df = df.drop(columns=['Pillar'])

df.to_csv('sorted_playlist_data.csv', index=False)
print("Pristine, re-sorted CSV generated with advanced topics isolated.")