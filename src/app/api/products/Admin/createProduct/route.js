// app/api/products/Admin/createProduct/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // ✅ Read JSON body (not FormData)
    const body = await request.json();

    const {
      productName,
      productDescription,
      productPrice,
      discountPrice,
      category,
      subCategory,
      productFeatures,
      texture,
      scent,
      color,
      packaging,
      stockQuantity,
      isInStock,
      thumbnailImage, // ✅ Now a URL string
      images,         // ✅ Array of URL strings
      videoUrl,       // ✅ URL string or null
    } = body;

    // Log for debugging
    console.log("📦 Received product data:", {
      productName,
      productPrice,
      category,
      thumbnailImage: thumbnailImage ? "✅ URL present" : "❌ Missing",
      imagesCount: images?.length || 0,
      videoUrl: videoUrl ? "✅ URL present" : "none",
    });

    // Validate required fields
    if (!productName || !productPrice || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name, price, and category are required",
        },
        { status: 400 },
      );
    }

    if (!thumbnailImage) {
      return NextResponse.json(
        {
          success: false,
          message: "Thumbnail image is required",
        },
        { status: 400 },
      );
    }

    // ✅ Forward as JSON to your NestJS backend
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/products/productCreate";

   

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName,
        productDescription: productDescription || "",
        productPrice: parseFloat(productPrice),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        subCategory: subCategory || "",
        productFeatures: productFeatures || "",
        texture: texture || "",
        scent: scent || "",
        color: color || "",
        packaging: packaging || "",
        stockQuantity: parseInt(stockQuantity) || 0,
        isInStock: isInStock !== false,
        // ✅ These are URLs now, not files
        thumbnailImage,
        images: Array.isArray(images) ? images : [],
        videoUrl: videoUrl || null,
      }),
    });

    console.log("📥 NestJS response status:", response.status);

    // Parse response safely
    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      console.error("❌ Invalid JSON from NestJS:", text);
      data = { message: "Invalid response from server" };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            data.message ||
            data.error ||
            `Failed to create product (${response.status})`,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: data,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create product",
      },
      { status: 500 },
    );
  }
}