import { prisma } from "@/lib/db";
import Image from "next/image";

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <Image src={product.image} alt={product.title} width={500} height={500} />
        <div>
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-xl mt-4 font-semibold">₹ {product.price}</p>
          <button className="mt-6 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
