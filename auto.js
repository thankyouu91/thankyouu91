// ==UserScript==
// @name         Enhanced Auto Build for Tribal Wars
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automates building in Tribal Wars with better resource management and customizable strategies.
// @author       YourName
// @match        https://*.tribalwars.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('Starting Enhanced Auto Build Script...');

    // User-configurable build settings
    const buildSettings = {
        mode: 'offensive', // Options: 'offensive', 'defensive', 'custom'
        customOrder: ['Headquarters', 'Smithy', 'Barracks', 'Stable'], // Custom build order
        delayRange: { min: 5000, max: 10000 }, // Delay between actions (milliseconds)
        resourceCheck: true // Enable resource checking before building
    };

    // Helper function for random delays
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to check resources (mock example, adjust as per actual game data)
    function hasSufficientResources(requiredWood, requiredClay, requiredIron) {
        const currentWood = parseInt(document.querySelector('#wood')?.textContent.replace(/\./g, ''), 10);
        const currentClay = parseInt(document.querySelector('#stone')?.textContent.replace(/\./g, ''), 10);
        const currentIron = parseInt(document.querySelector('#iron')?.textContent.replace(/\./g, ''), 10);

        console.log(`Current Resources - Wood: ${currentWood}, Clay: ${currentClay}, Iron: ${currentIron}`);
        return (currentWood >= requiredWood && currentClay >= requiredClay && currentIron >= requiredIron);
    }

    // Function to handle building upgrades
    async function autoBuildVillage() {
        console.log(`Auto building in ${buildSettings.mode} mode...`);
        const buildOrder = {
            offensive: ['Barracks', 'Stable', 'Workshop', 'Smithy'],
            defensive: ['Wall', 'Smithy', 'Warehouse', 'Headquarters'],
            custom: buildSettings.customOrder
        };

        for (let building of buildOrder[buildSettings.mode]) {
            const buildingElement = document.querySelector(`#${building}`); // Adjust this selector as needed
            if (buildingElement) {
                console.log(`Found ${building} element.`);
            } else {
                console.log(`${building} element not found.`);
                continue; // Skip to the next building if not found
            }

            if (!buildingElement.classList.contains('under-construction')) {
                if (!buildSettings.resourceCheck || hasSufficientResources(1000, 800, 500)) {
                    console.log(`Upgrading ${building}.`);
                    buildingElement.click(); // Simulate clicking the build/upgrade button
                    await new Promise(res => setTimeout(res, getRandomDelay(buildSettings.delayRange.min, buildSettings.delayRange.max))); // Delay between builds
                    break; // Only upgrade one building at a time
                } else {
                    console.log(`Not enough resources for ${building}.`);
                }
            } else {
                console.log(`${building} is already under construction.`);
            }
        }
    }

    // Main loop to periodically trigger the auto-build function
    (async function main() {
        while (true) {
            await autoBuildVillage();
            console.log('Waiting for the next build cycle...');
            await new Promise(res => setTimeout(res, getRandomDelay(60000, 120000))); // Delay between full cycles
        }
    })();
})();
