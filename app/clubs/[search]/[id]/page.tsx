"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { getClubById, getCourtsByClubId } from "@/lib/data";
import { Club, Court } from "@/lib/models";
import { mapClubLocation, mapClubTitle } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import InfiniteHorizontalScroll from "@/components/pures/InfiniteHorizontalScroll";
import {
  generateAvailableHoursPerClub,
  largeTurnIsPossible,
  verifyDisponibility,
} from "@/lib/manageReservationHours";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const ClubPage = ({ params }: { params: { id: string } }) => {
  const [club, setClub] = useState<Club>();
  const [selectedHour, setSelectedHour] = useState<string>();
  const [availableCourts, setAvailableCourts] = useState<Court[]>();
  const [date, setDate] = useState<Date>();
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    getClubById(params.id).then((res) => setClub(res));
  }, [params.id]);

  useEffect(() => {
    if (club) getCourtsByClubId(club.id).then((res) => setAvailableCourts(res));
  }, [club]);

  useEffect(() => {
    if (club && selectedHour)
      setAvailableCourts(
        verifyDisponibility(club, selectedHour, formattedDate)
      );
  }, [selectedHour]);

  useEffect(() => {
    if (date) {
      const fecha = new Date(date as Date);
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      const anio = fecha.getFullYear();
      setFormattedDate(`${dia}-${mes}-${anio}`);
    }
  }, [date]);

  return (
    <main className="mt-20 sm:mt-24">

      // Breadcrumb web
      <section className="hidden sm:block">
        {club ? (
          <Breadcrumb className="w-11/12 mx-auto">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/clubs/${club.location}`}
                    className="text-lg"
                  >
                    Clubes en {mapClubLocation(club.location)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-lg">
                  {mapClubTitle(club.name)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <div className="w-11/12 mx-auto">
            <Skeleton className="w-full sm:w-1/2 md:w-1/3 h-6" />
          </div>
        )}
      </section>

      {club && (
        <section className="sm:mt-4">
          {/* mobile version */}
          <div className="w-full block sm:hidden relative">
            <Image
              src={club.image}
              alt={`${club.name} banner picture`}
              height={200}
              width={500}
              priority
              className="w-full h-auto aspect-auto"
            />
            <div className="w-full h-10 absolute -bottom-1 left-0 bg-background rounded-t-3xl">
              <div className="w-11/12 mx-auto mt-4 flex justify-between items-center">
                <h3 className="text-xl">{mapClubTitle(club.name)}</h3>
                <div className="w-12 h-12 border-2 border-orange-300 active:bg-orange-300 text-orange-300 active:text-black transition-all rounded-full p-4 flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-2xl"
                  />
                </div>
              </div>
              <Separator className="w-11/12 mx-auto my-4" />

              <div className="w-11/12 mx-auto mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full pl-3 text-left font-normal"
                    >
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="center"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      /* TODO: no debe poder reservar con mas de 10 dias de anticipacion */
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <InfiniteHorizontalScroll
                hours={generateAvailableHoursPerClub(club, formattedDate)}
                setSelectedHour={setSelectedHour}
                blocked={formattedDate.length < 1}
              />

              <div className="w-11/12 mx-auto">
                {!selectedHour ? (
                  <span>Seleccione un horario</span>
                ) : availableCourts ? (
                  <ul className="mt-4">
                    {availableCourts.map((court: Court) => (
                      /* TODO: display the available courts in the selected hour */
                      <>
                        <li
                          key={court.id}
                          className="mt-2 py-2"
                        >
                          <span>{court.name}</span>
                          <div className="flex justify-between font-lg mt-2">
                            <span>60 minutos</span>
                            <span>
                              <Link
                                href={`/create-reservation/${club.id}?courtId=${court.id}&day=${formattedDate}&hour=${selectedHour}&duration=short`}
                              >
                                <FontAwesomeIcon icon={faArrowRight} />
                              </Link>
                            </span>
                          </div>
                          {/* TODO: mostrar para sacar turnos largos dependiendo de los turnos siguientes */}
                          {selectedHour &&
                            largeTurnIsPossible(court, selectedHour) && (
                              <Accordion
                                type="single"
                                collapsible
                              >
                                <AccordionItem value="duration">
                                  <AccordionTrigger className="text-sm">
                                    Otras duraciones
                                  </AccordionTrigger>
                                  <AccordionContent className="flex justify-between">
                                    <span>90 minutos</span>
                                    <span>
                                      {/* TODO: send the day of the reservation */}
                                      <Link
                                        href={`/create-reservation/${club.id}?courtId=${court.id}&day=${formattedDate}&hour=${selectedHour}&duration=large`}
                                      >
                                        <FontAwesomeIcon icon={faArrowRight} />
                                      </Link>
                                    </span>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )}
                        </li>
                        {availableCourts.indexOf(court) !==
                          availableCourts.length - 1 && <Separator />}
                      </>
                    ))}
                  </ul>
                ) : (
                  <span>No hay canchas</span>
                )}
              </div>
            </div>
          </div>

          {/* desktop version */}
          <div className="hidden sm:block w-11/12 mx-auto">
            <Image
              src={club.image}
              alt={`${club.name} banner picture`}
              height={200}
              width={500}
              priority
              className="w-full h-auto aspect-auto"
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default ClubPage;
