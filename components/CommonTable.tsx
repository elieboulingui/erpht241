// components/ui/common-table.tsx
import {
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCell as ShadcnTableCell,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";
import { ArrowDownUp } from 'lucide-react';
import { JSX, ReactNode } from 'react';

interface CommonTableProps {
  headers: {
    key: string;
    label: string | JSX.Element;  // Permet les chaînes et les éléments JSX
    width?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
  }[];
  rows: {
    id: string;
    [key: string]: ReactNode | string | number | undefined;
  }[];
  emptyState?: ReactNode;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  onSort?: (key: string) => void;
}


export function CommonTable({
  headers,
  rows,
  emptyState,
  className = '',
  headerClassName = 'bg-gray-300',
  rowClassName = '',
  cellClassName = '',
  onSort,
}: CommonTableProps) {
  return (
    <ShadcnTable className={`overflow-hidden ${className}`}>
      <ShadcnTableHeader className={headerClassName}>
        <ShadcnTableRow>
          {headers.map((header) => (
            <ShadcnTableHead 
              key={header.key} 
              className={header.width ? `w-[${header.width}]` : ''}
              style={{ textAlign: header.align || 'left' }}
            >
              <div className={`flex items-center ${header.align === 'center' ? 'justify-center' : ''}`}>
                <span>{header.label}</span>
                {header.sortable && (
                  <button 
                    onClick={() => onSort?.(header.key)}
                    className="ml-1"
                  >
                    <ArrowDownUp className="text-gray-500" size={16} />
                  </button>
                )}
              </div>
            </ShadcnTableHead>
          ))}
        </ShadcnTableRow>
      </ShadcnTableHeader>
      <ShadcnTableBody>
        {rows.length === 0 ? (
          <ShadcnTableRow>
            <ShadcnTableCell colSpan={headers.length} className="text-center p-4">
              {emptyState || 'Aucune donnée disponible'}
            </ShadcnTableCell>
          </ShadcnTableRow>
        ) : (
          rows.map((row) => (
            <ShadcnTableRow key={row.id} className={rowClassName}>
              {headers.map((header) => (
                <ShadcnTableCell 
                  key={`${row.id}-${header.key}`}
                  className={cellClassName}
                  style={{ textAlign: header.align || 'left' }}
                >
                  {row[header.key]}
                </ShadcnTableCell>
              ))}
            </ShadcnTableRow>
          ))
        )}
      </ShadcnTableBody>
    </ShadcnTable>
  );
}

// Composants alias pour une meilleure sémantique
export const Table = ShadcnTable;
export const TableBody = ShadcnTableBody;
export const TableCell = ShadcnTableCell;
export const TableHead = ShadcnTableHead;
export const TableHeader = ShadcnTableHeader;
export const TableRow = ShadcnTableRow;