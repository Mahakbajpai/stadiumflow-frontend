// Initial layout of the stadium mirroring frontend keys, with added labels/types
const INITIAL_STADIUM_STATE = {
    zones: {
      gateA: { id: 'gateA', name: 'Main Gate A', label: 'Gate', type: 'gate', density: 30, status: 'low' },
      gateB: { id: 'gateB', name: 'West Gate B', label: 'Gate', type: 'gate', density: 60, status: 'medium' },
      gateC: { id: 'gateC', name: 'VIP Gate C', label: 'Gate', type: 'gate', density: 10, status: 'low' },
      gateD: { id: 'gateD', name: 'East Gate D', label: 'Entry', type: 'gate', density: 85, status: 'high' },
      
      seating1: { id: 'seating1', name: 'Section 101-105', label: 'VIP Seat', type: 'seating', density: 40, status: 'low' },
      seating2: { id: 'seating2', name: 'Section 106-110', label: 'Prestige', type: 'seating', density: 75, status: 'medium' },
      seating3: { id: 'seating3', name: 'Section 111-115', label: 'Economy', type: 'seating', density: 95, status: 'high' },
      seating4: { id: 'seating4', name: 'Section 116-120', label: 'General', type: 'seating', density: 20, status: 'low' },
  
      food1: { id: 'food1', name: 'Burger Arena', label: 'Food Court', type: 'food', density: 80, waitTime: 25, status: 'high' },
      food2: { id: 'food2', name: 'Healthy Bowl', label: 'Food Stall', type: 'food', density: 30, waitTime: 5, status: 'low' },
      food3: { id: 'food3', name: 'Pizza Corner', label: 'Food Stall', type: 'food', density: 55, waitTime: 12, status: 'medium' },
  
      restroom1: { id: 'restroom1', name: 'Restroom North', label: 'Facilities', type: 'restroom', density: 45, waitTime: 3, status: 'low' },
      restroom2: { id: 'restroom2', name: 'Restroom South', label: 'Facilities', type: 'restroom', density: 85, waitTime: 15, status: 'high' },
      restroom3: { id: 'restroom3', name: 'Restroom East', label: 'Facilities', type: 'restroom', density: 60, waitTime: 8, status: 'medium' },
    },
    global: {
      totalAttendees: 42500,
      maxCapacity: 50000,
      averageWait: 12,
    }
  };
  
  export const getStadiumState = () => {
      // Return a deep copy to prevent unwanted direct mutations before initial serve
      return JSON.parse(JSON.stringify(INITIAL_STADIUM_STATE));
  };
  
  export const getAlerts = () => [];
  
  export const getPredictions = () => {
      return {
          nextHotspot: 'East Gate D',
          expectedIn: 8
      };
  };
