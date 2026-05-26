"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldCheck, ShieldAlert, ShieldX, Loader2 } from "lucide-react";

/**
 * ReputationBadge Component
 * Displays a visual reputation indicator for wallet addresses
 * Inspired by Ergo Reputation System
 */
export function ReputationBadge({ address, size = "sm", showScore = false, onClick }) {
    const [reputation, setReputation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!address) {
            setLoading(false);
            return;
        }

        const fetchReputation = async () => {
            try {
                const response = await fetch(`/api/reputation?address=${address}`);
                const data = await response.json();

                if (data.success) {
                    setReputation(data.reputation);
                }
            } catch (error) {
                console.error('Error fetching reputation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReputation();
    }, [address]);

    if (loading) {
        return (
            <div className="inline-flex items-center gap-1">
                <Loader2 className={`animate-spin ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} text-neutral-400`} />
            </div>
        );
    }

    if (!reputation) {
        return null;
    }

    const { trustLevel, score, flagCount } = reputation;

    // Icon and colors based on trust level
    const getIcon = () => {
        const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';

        switch (trustLevel.name) {
            case 'Trusted':
                return <ShieldCheck className={`${iconSize} text-green-400`} />;
            case 'Neutral':
                return <Shield className={`${iconSize} text-yellow-400`} />;
            case 'Caution':
                return <ShieldAlert className={`${iconSize} text-orange-400`} />;
            case 'Flagged':
                return <ShieldX className={`${iconSize} text-red-400`} />;
            default:
                return <Shield className={`${iconSize} text-neutral-400`} />;
        }
    };

    const getBgColor = () => {
        switch (trustLevel.name) {
            case 'Trusted':
                return 'bg-green-500/20 border-green-500/30';
            case 'Neutral':
                return 'bg-yellow-500/20 border-yellow-500/30';
            case 'Caution':
                return 'bg-orange-500/20 border-orange-500/30';
            case 'Flagged':
                return 'bg-red-500/20 border-red-500/30';
            default:
                return 'bg-neutral-500/20 border-neutral-500/30';
        }
    };

    const getTextColor = () => {
        switch (trustLevel.name) {
            case 'Trusted':
                return 'text-green-300';
            case 'Neutral':
                return 'text-yellow-300';
            case 'Caution':
                return 'text-orange-300';
            case 'Flagged':
                return 'text-red-300';
            default:
                return 'text-neutral-300';
        }
    };

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${getBgColor()} transition-all hover:opacity-80 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
            title={`${trustLevel.name} - Score: ${score}${flagCount > 0 ? ` (${flagCount} flags)` : ''}`}
        >
            {getIcon()}
            {showScore && (
                <span className={`text-xs font-medium ${getTextColor()}`}>
                    {score}
                </span>
            )}
            {size !== 'sm' && (
                <span className={`text-xs font-medium ${getTextColor()}`}>
                    {trustLevel.name}
                </span>
            )}
        </button>
    );
}

/**
 * Inline reputation indicator (just icon)
 */
export function ReputationIcon({ address, className = "" }) {
    const [trustLevel, setTrustLevel] = useState(null);

    useEffect(() => {
        if (!address) return;

        const fetchReputation = async () => {
            try {
                const response = await fetch(`/api/reputation?address=${address}`);
                const data = await response.json();

                if (data.success && data.reputation) {
                    setTrustLevel(data.reputation.trustLevel);
                }
            } catch (error) {
                console.error('Error fetching reputation:', error);
            }
        };

        fetchReputation();
    }, [address]);

    if (!trustLevel) return null;

    const getIcon = () => {
        switch (trustLevel.name) {
            case 'Trusted':
                return <ShieldCheck className={`h-4 w-4 text-green-400 ${className}`} />;
            case 'Flagged':
                return <ShieldX className={`h-4 w-4 text-red-400 ${className}`} />;
            default:
                return null;
        }
    };

    return getIcon();
}
