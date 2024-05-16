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
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import InfiniteHorizontalScroll from "@/components/pures/InfiniteHorizontalScroll";

const ClubPage = ({ params }: { params: { id: string } }) => {
  const [club, setClub] = useState<Club>();
  const [courts, setCourts] = useState<Court[]>();

  useEffect(() => {
    getClubById(params.id).then((res) => setClub(res));
  }, [params.id]);

  useEffect(() => {
    if (club) getCourtsByClubId(club.id).then((res) => setCourts(res));
  }, [club]);

  return (
    <main className="mt-20 sm:mt-24">
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
          <Skeleton className="w-full sm:w-1/2 md:w-1/3 h-6" />
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
              <InfiniteHorizontalScroll
                hours={[
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                ]}
              />
              <div className="w-11/12 mx-auto">
                {courts ? (
                  <ul>
                    {courts.map((court: Court) => (
                      <li>{court.name}</li>
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
