
/**
 * Rotates a 2d coordinate around the center of the coordinate system
 * 
 * @param x x coordinate
 * @param y y coordinate
 * @param angle angle to rotate
 * 
 * @returns The new coordinates as object {x: number, y: number}
 */
function rotateAroundCenter(x: number, y: number, angle: number) {
    return rotateAroundPoint(0, 0, x, y, angle);
}

/**
 * Rotates a 2d coordinate around the center given in the parameters
 * 
 * @param centralX x coordinate of the center to rotate around
 * @param centralY y coordinate of the center to rotate around
 * @param x x coordinate
 * @param y y coordinate
 * @param angle angle to rotate
 * 
 * @returns The new coordinates as object {x: number, y: number}
 */
function rotateAroundPoint(centralX: number, centralY: number, x: number, y: number, angle: number) {
    const rad = (Math.PI / 180) * angle;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const newX = (cos * (x - centralX)) - (sin * (y - centralY)) + centralX;
    const newY = (cos * (y - centralY)) + (sin * (x - centralX)) + centralY;
    return {x: newX, y: newY};
}

/**
 * Calculates current angle of an objec by the given parameters
 * 
 * @param passedTimeInMillis time passed since start of calculation in milliseconds
 * @param sim_day duration of a day in minutes
 * @param yearDuration amount of (earth) days the object takes to surround the center
 * 
 * @returns The angle as number the Objects needs to move for the next frame 
 */
function getAngle(passedTimeInMillis: number, sim_day: number, yearDuration: number) {
    const daysPassed = (passedTimeInMillis / (sim_day * 1000.0 * 60.0));
    return (360 * (daysPassed / yearDuration)) % 360;
}

/**
 * Calculates the rotation around its own axis by the given parameters
 * 
 * @param passedTimeInMillis time passed since start of calculation in milliseconds
 * @param sim_day duration of a day in minutes
 * @param rotationDuration amount of (earth) days the object takes rotate once around itself
 * 
 * @returns The angle as radians number the object needs on the y roation property
 */
function getRotation(passedTimeInMillis: number, sim_day: number, rotationDuration: number) {
    return getAngle(passedTimeInMillis, sim_day, rotationDuration) * Math.PI / 180;//Umrechnung von grad in radians
}

export {rotateAroundCenter, getAngle, rotateAroundPoint, getRotation};