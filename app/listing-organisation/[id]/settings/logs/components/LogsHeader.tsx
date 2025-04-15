import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";

export function LogsHeader() {
    return (
        <div className="">
            <BreadcrumbHeader
                title="Logs"
                withSearch
            />
        </div>
    );
}
