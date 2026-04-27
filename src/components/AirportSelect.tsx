import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Plane } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { searchAirports, formatAirport, type Airport } from "@/lib/airports";

interface Props {
  label: string;
  value: Airport | null;
  onChange: (a: Airport | null) => void;
  placeholder?: string;
}

const MAX_RESULTS = 20;

export const AirportSelect = ({ label, value, onChange, placeholder }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchAirports(query, MAX_RESULTS), [query]);

  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="mt-0.5 flex h-9 w-full items-center justify-between gap-2 bg-transparent px-0 text-sm font-medium outline-none"
          >
            <span
              className={cn(
                "flex items-center gap-2 truncate",
                !value && "text-muted-foreground font-normal"
              )}
            >
              <Plane className="h-3.5 w-3.5 opacity-60 shrink-0" />
              <span className="truncate">
                {value ? formatAirport(value) : placeholder ?? "Select airport"}
              </span>
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[340px] p-0 pointer-events-auto z-50"
          align="start"
        >
          {/* shouldFilter={false}: we filter via searchAirports for performance */}
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search city, airport, IATA, country…"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No airports found.</CommandEmpty>
              <CommandGroup
                heading={
                  query
                    ? `Top ${results.length} match${results.length === 1 ? "" : "es"}`
                    : "Popular airports"
                }
              >
                {results.map((a) => (
                  <CommandItem
                    key={a.iata}
                    value={a.iata}
                    onSelect={() => {
                      onChange(a);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.iata === a.iata ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {a.city}{" "}
                        <span className="font-normal text-muted-foreground">
                          — {a.airport}
                        </span>
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {a.iata} · {a.country}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
