/* ==========================================================================
   PROJECTS — edit this file only.
   --------------------------------------------------------------------------
   model : path to the 3D file (.glb from SOLIDWORKS: File > Save As > glTF Binary)
   video : leave "" to show the "Video coming soon" placeholder. When ready, use either
             - a file in the repo:   "assets/videos/travel-distance.mp4"   (keep under ~25 MB)
             - a YouTube link:       "https://www.youtube.com/watch?v=XXXXXXXXXXX"
   Anything left empty is hidden automatically.
   ========================================================================== */

window.PROJECTS = [
  {
    title: "Travel Distance Fixture",
    subtitle: "Instron fixture for sealant travel distance testing at a horizontal expression angle",
    summary:
      "Travel distance validation for a sealant had to be run at a horizontal expression angle, " +
      "but the Instron only loads vertically. I designed a dual rack-and-pinion mechanism that " +
      "translates the Instron's vertical crosshead force into controlled horizontal motion of the syringe, " +
      "enabling the ISO-standard test on existing equipment.",
    highlights: [
      "Dual rack-and-pinion converts vertical Instron force into controlled horizontal motion",
      "Mounts to the Instron base on an 80/20 extrusion frame with a dedicated syringe holder and upper clamp",
      "Test data from the fixture differentiated high- and low-functionality groups; results documented in a technical memo"
    ],
    specs: { Software: "SOLIDWORKS", "Test system": "Instron", Mechanism: "Rack & pinion" },
    tags: ["Fixture Design", "Mechanism Design", "Test Method Development", "Instron"],
    model: "assets/projects/travel-distance-fixture.glb",
    video: ""
  },
  {
    title: "Linear Actuator Cutting Fixture",
    subtitle: "Electromechanical fixture to automate device evaluation",
    summary:
      "An electromechanical test built around a linear actuator and custom parts to automate device " +
      "evaluation. The assembly combines a ball-bearing carriage on a guide rail, custom precision-blade clamps " +
      "and a micrometer positioning table, enabling repeatable testing without a $3,000 commercial option.",
    highlights: [
      "Linear actuator paired with a ball-bearing carriage on a 20 mm guide rail for straight, repeatable travel",
      "Micrometer positioning table and custom knife clamps for precise, repeatable setup",
      "Replaced a $3,000 commercial system with an in-house build"
    ],
    specs: { Software: "SOLIDWORKS", Drive: "Linear actuator", Guidance: "Ball-bearing rail" },
    tags: ["Fixture Design", "Electromechanical", "Automation", "Cost Reduction"],
    model: "assets/projects/actuator-cutting-fixture.glb",
    video: ""
  }
];
