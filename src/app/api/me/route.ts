import { config } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { compareSync, hashSync } from "bcrypt";
import { logicRules } from "@/lib/logic";

// Email validation regex
const emailRegex = /\S+@\S+\.\S+/;

// PATCH request handler
export const PATCH = async (request: NextRequest) => {
  // Get the session user
  const session = await getServerSession(config);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user._id;

  // Ensure the user ID is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return new NextResponse(
      JSON.stringify({ message: "User id is not valid" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Parse the request body
  const body = await request.json();
  const { name, email, currentPassword, newPassword } = body;

  // Validate name, email, and password
  if (
    name &&
    (name.length < logicRules.user.name.min ||
      name.length > logicRules.user.name.max)
  ) {
    return new NextResponse(
      JSON.stringify({ message: "Name must be at least 3 characters long." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (email && !emailRegex.test(email)) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid email address." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Connect to the database
  await dbConnect();

  // Find the user by ID
  const user = await UserModel.findById(userId);
  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if currentPassword is provided and validate it
  if (currentPassword) {
    const isMatch = compareSync(currentPassword, user.password);
    if (!isMatch) {
      return new NextResponse(
        JSON.stringify({ message: "Current password is incorrect." }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Update fields if they exist
  if (name) user.name = name;
  if (email) user.email = email;
  if (newPassword) {
    if (
      newPassword.length > logicRules.user.password.max ||
      newPassword.length < logicRules.user.password.min
    ) {
      return new NextResponse(
        JSON.stringify({ message: "New password is incorrect." }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    user.password = hashSync(newPassword, 5); // Hash the new password
  }

  // Save the updated user document
  await user.save();

  // Return the updated user (without password)
  const { password: _, ...updatedUser } = user.toObject(); // Exclude password

  return new NextResponse(JSON.stringify({ user: updatedUser }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
