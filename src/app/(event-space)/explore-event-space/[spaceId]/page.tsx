"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../../utils/supabase";
import Loading from "../../../../components/loading";
import { useParams } from "next/navigation";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userAuth } from "../../../../action/auth";

const EventPage = () => {
  const router = useRouter();
  const params = useParams();
  const { spaceId } = params;
  const [spaceData, setSpaceData]: any = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("event_space")
        .select("*,event_space_img_vid(event_space_id,url)")
        .eq("id", spaceId);
      if (error) {
        console.error("Error fetching event details:", error);
      } else {
        console.log(data);
        setSpaceData(data);
      }
      setIsLoading(false);
    }
    if (spaceId) {
      getData();
    }
  }, [spaceId]);

  async function isUser() {
    userAuth().then((res) => {
      if (!res) {
        router.push("/unauthorized");
      } else {
        router.push(`/register-event/${spaceId}`);
      }
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  const img = JSON.parse(spaceData[0].event_space_img_vid[0].url);
  const amenities = spaceData[0].amenities;

  return (
    <>
      <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[1rem] md:px-[2rem]">
        {spaceData.map((space: any) => (
          <div
            className="flex flex-wrap justify-center items-center"
            key={space.id}
          >
            <h1 className="text-2xl font-extrabold md:text-4xl text-center">
              {space.name}
            </h1>

            <div className="w-full md:w-[80%] p-10">
              {img.map((i: any) => {
                return (
                  <div key={i}>
                    <Image
                      src={i}
                      alt="event image"
                      className="w-full"
                      width={500}
                      height={500}
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4">
              <div className="w-full border border-white rounded-lg p-6 flex flex-col gap-2 md:gap-4">
                <h1 className="text-2xl font-extrabold">About Space</h1>
                <p className="text-justify">{space.description}</p>
                <h1>Space Capacity : {space.capacity}</h1>

                <h1 className="flex flex-row items-center gap-4">
                  Location : {space.location}
                </h1>
                <h1 className="flex flex-row items-center gap-4">
                  <div>
                    Price Per Hour:{" "}
                    <Badge variant="destructive">
                      <span>&#8377;</span>
                      {space.price_per_hour}
                    </Badge>
                  </div>
                  <div>
                    Availability:{" "}
                    <Badge variant="secondary">
                      {JSON.stringify(space.availability, null, 2)}
                    </Badge>
                  </div>
                </h1>

                <div className="border border-white"></div>
                <div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => isUser()}
                  >
                    Request Booking
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border border-white rounded-lg p-6 flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Owner Details</h1>
                  <h1>{space.owner_contact}</h1>
                  <h1>{space.owner_email}</h1>
                </div>

                <div className="border border-white rounded-lg p-6 flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Amenities</h1>
                  <h1 className="flex flex-wrap gap-2">
                    Available :{" "}
                    {amenities.map((tag: any) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EventPage;
