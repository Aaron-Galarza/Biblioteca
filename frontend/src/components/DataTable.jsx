import React from "react";
import ActionButton from "./ActionButton";

const DataTable = ({ 
  headers, 
  data, 
  actions = [],
  emptyMessage = "No hay datos disponibles",
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
            {actions.length > 0 && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={headers.length + (actions.length > 0 ? 1 : 0)} 
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="group">
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                {actions.length > 0 && (
                  <td>
                    <div className="flex gap-2">
                      {actions.map((action, actionIndex) => (
                        <ActionButton
                          key={actionIndex}
                          variant={action.variant || "outline"}
                          size="sm"
                          onClick={() => action.onClick(row)}
                          disabled={action.disabled?.(row)}
                        >
                          {action.label}
                        </ActionButton>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;