import React, { useState, useRef } from "react";
import "./App.css";
import { CategoryRepository, PhoneRepository } from "../../ts/repository";
import Tuio from "../../ts/tuio";
import LeftContainer from "../leftcontainer/LeftContainer";
import MiddleContainer from "../middlecontainer/MiddleContainer";
import { Graph } from "../../ts/draw";
import { TrackedPhone, Phone } from "../../ts/types";
import { Category, MainCategory } from "../../ts/category";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Card, Container, Box } from "@material-ui/core";
import PhoneList from "../phonelist/PhoneList";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import * as d3 from "d3";

export function App(props: {}) {
  const [tuio] = useState(new Tuio());
  const [repository] = useState(new PhoneRepository(tuio));
  const [categories] = useState(new CategoryRepository());
  return (
    <PhoneSpecs
      tuio={tuio}
      repository={repository}
      categories={categories}
    ></PhoneSpecs>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "95vh",
  },
  separate: {
    padding: theme.spacing(2),
    textAlign: "center",
    background: "linear-gradient(45deg, #372d54 30%, #6e5d9e 90%)",
    borderRadius: 3,
    border: 0,
    height: "95vh",
  },
}));

function PhoneSpecs(props: {
  tuio: Tuio;
  repository: PhoneRepository;
  categories: CategoryRepository;
}) {
  const [activeCategory, setActiveCategory] = useState<Category>(
    props.categories.main
  );
  const [trackedPhones, setTrackedPhones] = useState<TrackedPhone[]>([]);
  const phoneColRef = useRef<HTMLDivElement>();
  const trackedColors = d3.schemeSet2;

  function handleCategoryChange(category: Category) {
    console.log("new active is", category);
    setActiveCategory(category);
  }

  function handleGraphChange(newGraph: Graph) {
    console.log("new graph is", newGraph);

    setActiveCategory({ ...activeCategory, currentGraph: newGraph });
  }

  /**
   * Decides whether the given dragged phone should influence the
   * visualisation based on its position.
   * @param phone
   * @param rect
   */
  function handleDrag(phone: Phone, rect: any) {
    const node = phoneColRef.current;
    let x = rect.x;
    if (node) {
      const phoneListRect = node.getBoundingClientRect();
      // only track phones in active part of screen
      const newList = trackedPhones.filter((tp) => tp.id !== phone.symbolId);
      if (x < phoneListRect.x) {
        let tpIndex = trackedPhones.findIndex((tp) => tp.id === phone.symbolId);
        if (tpIndex > -1) {
          // phone already known, just change rect
          let tracked = {
            id: phone.symbolId,
            rect: rect,
            color: trackedPhones[tpIndex].color,
          };
          newList.push(tracked);
          setTrackedPhones(newList);
        } else {
          // new tracked phone needs a free color
          let tracked = {
            id: phone.symbolId,
            rect: rect,
            color: "white",
          };
          let i = 0;
          let stop = false;
          while (i < trackedColors.length && !stop) {
            let color = trackedColors[i];
            let colorInUse = trackedPhones.find((tp) => tp.color === color);
            if (colorInUse) {
              i += 1;
            } else {
              tracked.color = color;
              newList.push(tracked);
              setTrackedPhones(newList);
              stop = true;
            }
          }
        }
      } else {
        setTrackedPhones(newList);
      }
    }
    console.log("now tracking", trackedPhones.length, "phones");
  }
  const classes = useStyles();
  let suggestions;
  if (activeCategory instanceof MainCategory) {
    suggestions = null;
  } else {
    suggestions = (
      <Grid item xs={2}>
        <Card className={classes.paper}>Suggesties</Card>
      </Grid>
    );
  }

  return (
    <div
      className={classes.root}
      style={{ height: "100vh", width: "100vw", padding: "1%" }}
    >
      <DndProvider backend={Backend}>
        <Box width="100%">
          <Container disableGutters={true}>
            <Grid
              container
              spacing={2}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={2}>
                <Card className={classes.paper}>
                  <LeftContainer
                    categories={props.categories}
                    active={activeCategory}
                    onClick={(category) => handleCategoryChange(category)}
                  />
                </Card>
              </Grid>
              <Grid item xs>
                <Card className={classes.paper}>
                  <MiddleContainer
                    phoneRepo={props.repository}
                    active={activeCategory}
                    trackedPhones={trackedPhones}
                    onGraphChange={(graph) => handleGraphChange(graph)}
                  />
                </Card>
              </Grid>
              {suggestions}
              <Grid item xs={1}>
                <Card className={classes.separate} ref={phoneColRef}>
                  <PhoneList
                    phones={props.repository.getPhonesWithImage()}
                    onDrag={(p, rect) => handleDrag(p, rect)}
                  ></PhoneList>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </DndProvider>
      {trackedPhones.map((tp) => {
        if (!(activeCategory instanceof MainCategory)) {
          return (
            <div
              key={tp.id}
              style={{
                position: "absolute",
                left: tp.rect.x - 10,
                top: tp.rect.y - 10,
                zIndex: 10,
                width: 60,
                height: 100,
                backgroundColor: tp.color,
              }}
            ></div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default PhoneSpecs;
