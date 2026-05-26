"use client";

import { AlertTriangle, ShieldX, X } from "lucide-react";
import { useState } from "react";

/**
 * ScamWarning Component
 * Displays a warning banner for flagged/suspicious addresses
 * Inspired by Ergo Reputation System's spam filtering
 */
export function ScamWarning({ address, flagCount, onDismiss, onProceed }) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed || flagCount < 1) {
        return null;
    }

    const getSeverity = () => {
        if (flagCount >= 5) return 'critical';
        if (flagCount >= 3) return 'high';
        return 'medium';
    };

    const severity = getSeverity();

    const getStyles = () => {
        switch (severity) {
            case 'critical':
                return {
                    bg: 'bg-red-900/50 border-red-500/50',
                    icon: 'text-red-400',
                    text: 'text-red-200',
                    subtext: 'text-red-300/70',
                };
            case 'high':
                return {
                    bg: 'bg-red-900/30 border-red-500/30',
                    icon: 'text-red-400',
                    text: 'text-red-200',
                    subtext: 'text-red-300/70',
                };
            default:
                return {
                    bg: 'bg-orange-900/30 border-orange-500/30',
                    icon: 'text-orange-400',
                    text: 'text-orange-200',
                    subtext: 'text-orange-300/70',
                };
        }
    };

    const styles = getStyles();

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };

    return (
        <div className={`relative p-4 rounded-lg border ${styles.bg} animate-pulse-slow`}>
            {/* Dismiss button */}
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
                <X className="h-4 w-4 text-neutral-400" />
            </button>

            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-full ${severity === 'critical' ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
                    {severity === 'critical' ? (
                        <ShieldX className={`h-5 w-5 ${styles.icon}`} />
                    ) : (
                        <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold ${styles.text}`}>
                        {severity === 'critical' ? '⚠️ High Risk Address' : '⚠️ Caution Required'}
                    </h4>
                    <p className={`text-xs mt-1 ${styles.subtext}`}>
                        This address has been flagged by {flagCount} user{flagCount > 1 ? 's' : ''} as suspicious.
                        {severity === 'critical' && ' We strongly recommend not proceeding with this transaction.'}
                    </p>

                    {/* Truncated address */}
                    <p className="text-xs font-mono text-neutral-400 mt-2">
                        {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'Unknown'}
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleDismiss}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-700 text-neutral-200 hover:bg-neutral-600 transition-colors"
                        >
                            Cancel
                        </button>
                        {onProceed && (
                            <button
                                onClick={onProceed}
                                className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-600/50 text-red-200 hover:bg-red-600/70 transition-colors"
                            >
                                Proceed Anyway
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Compact inline scam warning
 */
export function ScamWarningInline({ flagCount }) {
    if (flagCount < 1) return null;

    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-xs text-red-300">
            <AlertTriangle className="h-3 w-3" />
            {flagCount} flag{flagCount > 1 ? 's' : ''}
        </span>
    );
}
