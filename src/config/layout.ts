import * as THREE from "three";

/**
 * OFFHAND OS — Machine Room spatial layout.
 * Shared by the room (to place monoliths/core/conduits) and the camera rig
 * (to drive the fly-through spline) so geometry and motion always agree.
 */

export const MODULE_COUNT = 8;
export const STATION_SPACING = 16; // z-distance between module stations
export const MODULE_SIDE = 6.8; // lateral offset of a module from the aisle
export const FLOOR_Y = -3;
export const SLAB_THICKNESS = 0.9; // x-thickness of a module slab

/** Module monolith positions, alternating left/right down the hall. */
export const modulePositions: THREE.Vector3[] = Array.from(
  { length: MODULE_COUNT },
  (_, i) => {
    const left = i % 2 === 0;
    return new THREE.Vector3(
      left ? -MODULE_SIDE : MODULE_SIDE,
      0,
      -(i + 1) * STATION_SPACING
    );
  }
);

/** Central OFFHAND core, at the far end of the hall (the finale / presence). */
export const corePosition = new THREE.Vector3(
  0,
  0.5,
  -(MODULE_COUNT + 1.4) * STATION_SPACING
);

/**
 * Camera waypoints: establishing shot → in front of each module → approach core.
 * The camera stays in the aisle but drifts toward each module's side as it passes.
 */
export const cameraWaypoints: THREE.Vector3[] = [
  new THREE.Vector3(0, 1.6, 9),
  ...modulePositions.map(
    (m) => new THREE.Vector3(m.x * 0.28, 1.3, m.z + 9.5)
  ),
  new THREE.Vector3(0, 3.0, corePosition.z + 18),
];

export const cameraCurve = new THREE.CatmullRomCurve3(
  cameraWaypoints,
  false,
  "catmullrom",
  0.4
);

/** Number of travel segments between waypoints (used for dwell easing). */
export const CAMERA_SEGMENTS = cameraWaypoints.length - 1;
