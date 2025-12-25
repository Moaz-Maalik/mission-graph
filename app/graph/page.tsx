"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GraphView } from "./GraphView";
import { ComponentCatalog } from "./ComponentCatalog";
import { SubflowModal } from "@/components/SubflowModal";
import { useGraphSubflowContext } from "@/context/GraphSubflowContext";

export default function GraphPage() {
  const graph = useQuery(api.queries.getGraph.default);
  const { menu, modal, openSubflow, closeMenu, closeModal } =
    useGraphSubflowContext();

  if (!graph) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <ComponentCatalog />
      <div className="flex-1">
        <GraphView graph={graph} />
        {menu && (
          <div className="fixed inset-0 z-[1000]" onMouseDown={closeMenu}>
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {/* centered menu */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="
          min-w-[220px]
          rounded-md
          bg-white
          border
          shadow-lg
          pointer-events-auto
        "
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="border-b px-3 py-2 text-sm font-medium">
                  Actions
                </div>

                {menu.subflows.map((sf) => (
                  <button
                    key={sf}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      openSubflow(menu.componentId, sf);
                    }}
                  >
                    {sf}
                  </button>
                ))}

                <button
                  className="block w-full px-3 py-2 text-left text-xs text-gray-500 hover:bg-gray-50"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    closeMenu();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {modal && (
          <SubflowModal
            title={modal.title}
            result={modal.result}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}
