"use client";
import { useEffect } from 'react';
import party from 'party-js';

interface ConfettiEffectProps {
    trigger: boolean;
    onComplete?: () => void;
}

export function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
    useEffect(() => {
        if (trigger) {
            // Create confetti from multiple points
            const duration = 3000;

            // Center explosion
            party.confetti(document.body, {
                count: party.variation.range(80, 120),
                spread: party.variation.range(40, 80),
            });

            // Side explosions
            setTimeout(() => {
                const leftSide = document.createElement('div');
                leftSide.style.position = 'fixed';
                leftSide.style.left = '20%';
                leftSide.style.top = '50%';
                document.body.appendChild(leftSide);

                party.confetti(leftSide, {
                    count: party.variation.range(40, 60),
                });

                setTimeout(() => document.body.removeChild(leftSide), 100);
            }, 200);

            setTimeout(() => {
                const rightSide = document.createElement('div');
                rightSide.style.position = 'fixed';
                rightSide.style.right = '20%';
                rightSide.style.top = '50%';
                document.body.appendChild(rightSide);

                party.confetti(rightSide, {
                    count: party.variation.range(40, 60),
                });

                setTimeout(() => document.body.removeChild(rightSide), 100);
            }, 400);

            if (onComplete) {
                setTimeout(onComplete, duration);
            }
        }
    }, [trigger, onComplete]);

    return null;
}
