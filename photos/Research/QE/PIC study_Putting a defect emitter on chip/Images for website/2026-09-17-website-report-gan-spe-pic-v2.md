# Putting a GaN Single-Photon Emitter on a Chip

*Quantum Emitters · Photonic Integration · Design study, September 2026*

## The goal

My M.Sc. research focuses on single-photon emitters in p-type GaN that work at room temperature. I study them on an optical table, with a confocal microscope and a Hanbury Brown and Twiss (HBT) interferometer I built and automated myself. That setup works, but it is large, sensitive to alignment, and loses light at every lens and fiber.

So I asked a simple question: what would it take to move this experiment onto a chip?

To answer it, I used Lumerical to design the first building blocks of an on-chip HBT measurement. The emitter sits inside a GaN waveguide, the waveguide carries its photons to a 50:50 splitter, and the splitter sends them to two outputs. Everything is designed at 768 nm, the emission wavelength of one of my own MBE-grown p-GaN emitters.

## Step 1: A waveguide that carries one clean mode

A photonic circuit starts with its waveguide. I needed the widest GaN ridge that still guides a single mode of each polarization, because a single-mode guide sends every captured photon into one well-defined path. I modeled a 500 nm tall GaN ridge on sapphire and swept its width with the eigenmode solver.

![Figure 1](Figure_1.png)

**Figure 1.** (a) The waveguide model in Lumerical MODE: a GaN ridge (red) on a sapphire substrate, with the solver cross-section and mesh region. (b) The fundamental mode of a first test ridge, 0.8 µm wide. This width is too wide and guides several modes. (c) The fundamental mode of the final 300 nm by 500 nm ridge. The light stays tightly confined inside the GaN.

The ridge stays single-mode up to 330 nm. I chose 300 nm, which keeps the light well confined and leaves room for fabrication error.

## Step 2: How much light can the waveguide capture?

A waveguide is only useful if the emitter's light actually enters it. I placed a dipole source inside the ridge to represent the emitter and ran full 3D FDTD simulations. From these I calculated the β factor, which is the fraction of emitted photons captured by the guided mode, and the Purcell factor, which tells how much the waveguide changes the emission rate. I checked every result against a finer mesh, and the numbers changed by less than 1%.

![Figure 2](Figure_2_3_4_together.png)

**Figure 2.** Left: number of guided TE-like and TM-like modes versus ridge width at 750 nm. The shaded region is single-mode, and the dotted line marks the chosen 300 nm width. Middle: Purcell factor versus wavelength for a lateral dipole at the ridge center. The star is the fine-mesh check at 768 nm. Right: β factor at 768 nm versus emitter depth for three dipole orientations and their average. The dashed line marks the measured depth of my emitters, 400 nm below the surface.

The result is encouraging. A vertically oriented emitter at the center of the ridge sends up to **50%** of its photons into the waveguide. A sideways emitter reaches **39%**. At the depth where my real emitters sit, the waveguide still captures **26% to 31%** of the light, depending on orientation. The simulations also show that the emission rate barely changes, and that the chip layout should follow the emitter's polarization: a waveguide running along the dipole captures almost nothing.

## Step 3: Designing the on-chip beam splitter

The heart of an HBT measurement is a 50:50 beam splitter. On a chip, this role is played by a multimode interference (MMI) splitter, a short, wide section of waveguide where several modes interfere and form two copies of the input light. I designed it for the TE-like mode, which matches the in-plane emission I see in my polarization measurements.

![Figure 3](Figure_5.png)

**Figure 3.** (a) The 1×2 MMI splitter model: 300 nm input and output waveguides joined by a 2.0 µm wide GaN section. (b) Spacing between the modes of the wide section compared with the ideal self-imaging condition. The close match means the two output images should form cleanly. (c) The first four TE-like modes of the wide section at 768 nm.

From the mode analysis, the first 50:50 image forms at a length of **5.88 µm**. The mode spacings follow the ideal pattern almost exactly, with only a small phase error in the highest mode.

## Where the project stands

Three of the five design milestones are complete:

| Milestone | Status |
|---|---|
| Single-mode waveguide at the emitter wavelength | Done |
| Emitter coupling calculated (β up to 0.50) | Done |
| Splitter designed from mode analysis (5.88 µm) | Done |
| Splitter confirmed by full propagation simulation | In progress |
| Circuit model of the complete HBT front end | Planned |

The waveguide and the emitter coupling are finished and verified. The splitter design is complete on paper, but its 50:50 ratio still needs to be confirmed by a full propagation simulation.

## What comes next

1. Confirm the splitter with eigenmode expansion (EME) and an independent 3D FDTD simulation. My first EME runs gave unrealistic results, so I am now checking the model settings.
2. Fine-tune the splitter length and test it across the full emission band, 740 to 800 nm.
3. Export the splitter response and connect all the parts in Lumerical INTERCONNECT.
4. Bring the model closer to my real samples by adding the actual GaN layer stack and the wavelength dependence of GaN.

This project is my first step from studying quantum light in a lab to designing the circuits that can carry it.

*Reference: L. B. Soldano and E. C. M. Pennings, J. Lightwave Technol. 13, 615 (1995).*
