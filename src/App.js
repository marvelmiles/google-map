import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import StreetView from "@material-ui/icons/Streetview";
import LocationOn from "@material-ui/icons/LocationOn";
import LocationCity from "@material-ui/icons/LocationCity";
import Explore from "@material-ui/icons/Explore";
import AutoComplete from "react-google-autocomplete";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import GeoCode from "react-geocode";
import { getArea, getCity, getState } from "./utils";
import { useEffect } from "react";
GeoCode.setApiKey(process.env.REACT_APP_API_KEY);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}
const App = (props) => {
  const [state, setState] = useState({
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    mapPosition: {
      lat: 0,
      lng: 0,
    },
    markerPosition: {
      lat: 0,
      lng: 0,
    },
  });
  const classes = useStyles();
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPlace(false, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

  const setPlace = (data, { lat, lng }) => {
    if (data && data.formatted_address) {
      const address = data.formatted_address,
        addrArr = data.address_components,
        city = getCity(addrArr),
        state = getState(addrArr),
        area = getArea(addrArr);
      setState({
        ...state,
        address,
        city,
        state,
        area,
        markerPosition: {
          lat: lat,
          lng: lng,
        },
        mapPosition: {
          lat: lat,
          lng: lng,
        },
      });
    } else {
      GeoCode.fromLatLng(lat, lng).then((r) => {
        const address = r.results[0].formatted_address,
          addrArr = r.results[0].address_components,
          city = getCity(addrArr),
          state = getState(addrArr),
          area = getArea(addrArr);
        setState({
          ...state,
          address,
          city,
          state,
          area,
          markerPosition: {
            lat: lat,
            lng: lng,
          },
          mapPosition: {
            lat: lat,
            lng: lng,
          },
        });
      });
    }
  };

  const onMarkerDragEnd = (e) => {
    let newLat = e.latLng.lat();
    let newLng = e.latLng.lng();
    setPlace(false, { lat: newLat, lng: newLng });
  };
  const MapWithAMarker = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{
          lat: state.mapPosition.lat,
          lng: state.mapPosition.lng,
        }}
      >
        <Marker
          draggable={true}
          onDragEnd={onMarkerDragEnd}
          position={{
            lat: state.markerPosition.lat,
            lng: state.markerPosition.lng,
          }}
        >
          {state.address && (
            <InfoWindow>
              <div>
                <>
                  <h4>
                    Current city: {state.city},
                    <LocationOn style={{ marginTop: "10px" }} /> {state.area}.
                  </h4>
                  <h5>Address: {state.address}</h5>
                </>
              </div>
            </InfoWindow>
          )}
        </Marker>
        <AutoComplete
          style={{
            width: "100%",
            hright: "40px",
            padding: 16,
            marginTop: 2,
            marginBottom: "2rem",
            border: "none",
            borderBottom: "1px solid #333",
            outline: "none",
          }}
          onPlaceSelected={(data) =>
            setPlace(data, {
              lat: data.geometry.location.lat(),
              lng: data.geometry.location.lng(),
            })
          }
          types={["regions"]}
        />
      </GoogleMap>
    ))
  );

  return (
    <>
      <div
        style={{ margin: "0 auto", maxWidth: 1000, padding: "1rem" }}
        className={classes.root}
      >
        <h1>Google Maps</h1>
        <div className={classes.root}>
          <List component="nav" aria-label="main mailbox folders">
            {state.address && (
              <ListItem button>
                <ListItemIcon>
                  <StreetView />
                </ListItemIcon>
                <ListItemText primary={state.address} />
              </ListItem>
            )}
            {state.state && (
              <ListItem button>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary={state.state} />
              </ListItem>
            )}
            {state.city && (
              <ListItem button>
                <ListItemIcon>
                  <LocationCity />
                </ListItemIcon>
                <ListItemText primary={state.city} />
              </ListItem>
            )}
            {state.area && (
              <ListItem button>
                <ListItemIcon>
                  <Explore />
                </ListItemIcon>
                <ListItemText primary={state.area} />
              </ListItem>
            )}
          </List>
        </div>
      </div>

      <MapWithAMarker
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </>
  );
};

export default App;
