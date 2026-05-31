import type { ReactNode } from "react";
import type { ProductId } from "@/lib/products";

interface Props {
  productId: ProductId;
  children: ReactNode;
}

// The frame that hosts a simulated product. Applies the per-product theme
// via the `data-product` attribute, which switches the `--p-*` CSS vars
// defined in styles.css. Children render inside a chrome-bordered surface.
export function WorkspaceFrame({ productId, children }: Props) {
  return (
    <div
      className="product-skin h-full w-full overflow-hidden border-l"
      data-product={productId}
      style={{ background: "var(--p-bg)", color: "var(--p-ink)" }}
    >
      {children}
    </div>
  );
}
