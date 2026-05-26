/**
 * Reputation API Route
 * GET - Get reputation for an address
 * POST - Flag or upvote an address
 */

import {
    getReputation,
    flagAddress,
    upvoteAddress,
    getAllReputations,
    recordSuccessfulTx,
    getFlags
} from '../../lib/reputation';

export default async function handler(req, res) {
    // GET - Fetch reputation data
    if (req.method === 'GET') {
        const { address, all } = req.query;

        // Get all reputations (leaderboard)
        if (all === 'true') {
            const allReps = getAllReputations();
            return res.status(200).json({
                success: true,
                reputations: allReps
            });
        }

        // Get single address reputation
        if (!address) {
            return res.status(400).json({
                success: false,
                error: 'Address parameter required'
            });
        }

        const reputation = getReputation(address);
        const flags = getFlags(address);

        return res.status(200).json({
            success: true,
            reputation,
            flags,
        });
    }

    // POST - Flag, upvote, or record transaction
    if (req.method === 'POST') {
        const { action, targetAddress, fromAddress, reason } = req.body;

        if (!action || !targetAddress) {
            return res.status(400).json({
                success: false,
                error: 'Action and targetAddress required'
            });
        }

        switch (action) {
            case 'flag':
                if (!fromAddress) {
                    return res.status(400).json({
                        success: false,
                        error: 'fromAddress required for flagging'
                    });
                }
                const flagResult = flagAddress(targetAddress, fromAddress, reason);
                return res.status(flagResult.success ? 200 : 400).json(flagResult);

            case 'upvote':
                if (!fromAddress) {
                    return res.status(400).json({
                        success: false,
                        error: 'fromAddress required for upvoting'
                    });
                }
                const upvoteResult = upvoteAddress(targetAddress, fromAddress);
                return res.status(upvoteResult.success ? 200 : 400).json(upvoteResult);

            case 'record_tx':
                const txResult = recordSuccessfulTx(targetAddress);
                return res.status(200).json({ success: txResult });

            default:
                return res.status(400).json({
                    success: false,
                    error: 'Invalid action. Use: flag, upvote, or record_tx'
                });
        }
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
}
