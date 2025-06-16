import { experiments } from "./experiments";

export const locations = [
  {
    id: "loc1",
    coordinates: [38.710718499960194, -9.141147063624015],
    experiment: experiments[0],
    participants: Math.floor(Math.random() * 100),
    color: '#EE1D37'
  },
  {
    id: "loc2",
    coordinates: [38.709919471081236, -9.141783103313244],
    experiment: experiments[2],
    participants: Math.floor(Math.random() * 100),
    color: '#2A2E7F'
  },
  {
    id: "loc3",
    coordinates: [38.70936367189781, -9.141035938528868],
    experiment: experiments[4],
    participants: Math.floor(Math.random() * 100),
    color: '#F26621'
  },
  {
    id: "loc4",
    coordinates: [38.71051404423506, -9.142222742037356],
    experiment: experiments[9],
    participants: Math.floor(Math.random() * 100),
    color: '#5690CC'
  },
  {
    id: "loc5",
    coordinates: [38.75574218614203, -9.157839554723555],
    experiment: experiments[11],
    participants: Math.floor(Math.random() * 100),
    color: '#B0D351'
  },
  {
    id: "loc6",
    coordinates: [38.756503621713556, -9.158023976334482],
    experiment: experiments[13],
    participants: Math.floor(Math.random() * 100),
    color: '#ED3A95'
  },
  {
    id: "loc7",
    coordinates: [38.752939351221734, -9.157592357864337],
    experiment: experiments[14],
    participants: Math.floor(Math.random() * 100),
    color: '#7161AB'
  },
];
