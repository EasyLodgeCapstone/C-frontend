// app/api/products/Admin/createProduct/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // Get FormData from the request
    const formData = await request.formData();

    console.log("=== Form Data Received ===");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Extract text fields
    const productName = formData.get("productName");
    const productDescription = formData.get("productDescription");
    const productPrice = formData.get("productPrice");
    const discountPrice = formData.get("discountPrice");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const productFeatures = formData.get("productFeatures");
    const texture = formData.get("texture");
    const scent = formData.get("scent");
    const color = formData.get("color");
    const packaging = formData.get("packaging");
    const stockQuantity = formData.get("stockQuantity");
    const isInStock = formData.get("isInStock") === "true";

    // Extract files
    const thumbnail = formData.get("thumbnailImage");
    const gallery = formData.getAll("gallery");
    const video = formData.get("video");

    // Validate required fields
    if (!productName || !productPrice || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name, price, and category are required",
        },
        { status: 400 }
      );
    }

    //  If you need to send to another backend, use FormData there too
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/products/productCreate";
    
    //  Create a NEW FormData for the external API
    const externalFormData = new FormData();
    
    // Add all text fields to external FormData
    externalFormData.append("productName", productName);
    externalFormData.append("productDescription", productDescription || "");
    externalFormData.append("productPrice", productPrice);
    if (discountPrice) externalFormData.append("discountPrice", discountPrice);
    externalFormData.append("category", category);
    if (subCategory) externalFormData.append("subCategory", subCategory);
    if (productFeatures) externalFormData.append("productFeatures", productFeatures);
    if (texture) externalFormData.append("texture", texture);
    if (scent) externalFormData.append("scent", scent);
    if (color) externalFormData.append("color", color);
    if (packaging) externalFormData.append("packaging", packaging);
    externalFormData.append("stockQuantity", stockQuantity);
    externalFormData.append("isInStock", String(isInStock));

    //  Add files to external FormData (they're already File objects)
    if (thumbnail) {
      externalFormData.append("thumbnail", thumbnail);
    }
    
    if (gallery.length > 0) {
      gallery.forEach((file) => {
        externalFormData.append("gallery", file);
      });
    }
    
    if (video) {
      externalFormData.append("video", video);
    }

    //  Send FormData (NOT JSON)
    const response = await fetch(url, {
      method: "POST",
      body: externalFormData, 
    });

    console.log("External API response status:", response.status);

    // Try to parse response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { message: "Invalid response from server" };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || data.error || "Failed to create product",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: data,
    });

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create product",
      },
      { status: 500 }
    );
  }
}