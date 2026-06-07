import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/models.js";

export const logGreenPurchase = asyncHandler(async (req, res) => {
  const { purchaseType, details } = req.body;
  const clerkId = req.auth.userId;

  // Validate user
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Calculate dummy rewards if needed, e.g. 50 tokens
  const tokensEarned = 50;

  // Update user tokens
  user.greenTokens += tokensEarned;
  await user.save({ validateBeforeSave: false });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        purchaseType,
        tokensEarned,
        newTotalTokens: user.greenTokens
      },
      "Purchase logged and tokens rewarded successfully!"
    )
  );
});
