import { formatChange, format } from "../../utils/format.js";
import Decimal, { D } from "../../utils/break_eternity.js";
import { player } from "../../player.js";
import { Resource, RESOURCES } from "../../components/resources.js";
import { Upgrade, UPGRADES, getUpgrade } from "../../components/buyables.js";
import { TABS } from "../../components/tabs.js";

import { getMiner } from "./miners.js";

RESOURCES.greenPaper = new Resource({
  name: "Green Papers",
  color: "green",
  src: {
    parent: () => player.gp,
    id: "amt"
  }
});

UPGRADES.GreenPapers = {
  res: "greenPaper",
  player: () => player.gp.upg,
  data: [
    new Upgrade({
      name: "Miner Power",
      cost: (lvl) => Decimal.pow(1.3, lvl).mul(1),
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 20,
      desc(eff) {
        return `Miner effectiveness is increased by ${formatChange(eff)}<br>`;
      },
      group: "GreenPapers"
    }),
    new Upgrade({
      name: "Speed Mining",
      cost: (lvl) => Decimal.pow(1.6, lvl).mul(5),
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 20,
      desc(eff) {
        return `Miner speed is increased by ${formatChange(eff)}`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 0).amt.gte(1)
    }),
    new Upgrade({
      name: "Fortune Mining",
      cost: (lvl) => Decimal.pow(2, lvl).mul(25),
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 20,
      desc(eff) {
        return `You get ${formatChange(eff)} more ores`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 1).amt.gte(1)
    }),
    new Upgrade({
      name: "Forgery",
      cost: () => D(100),
      eff: () => 1,
      desc() {
        return `You can create better Pickaxes with Bronze and Silver. (NOT IMPLEMENTED)`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 2).amt.gte(1)
    }),
    new Upgrade({
      name: "Refinery",
      cost: () => D(250),
      eff: () => 1,
      desc() {
        return `You can buy blocks with Green Papers.`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 3).amt.gte(1)
    }),
    new Upgrade({
      name: "Ore Luck",
      cost: (lvl) => Decimal.pow(3, lvl).mul(1000),
      eff: (lvl) => D(lvl).div(20).add(1),
      max: 20,
      desc(eff) {
        return `Ores spawn ${formatChange(eff)} more frequently`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 4).amt.gte(1)
    }),
    new Upgrade({
      name: "Softer Atoms",
      cost: (lvl) => Decimal.pow(5, lvl).mul(5000),
      eff: (lvl) => D(1.015).pow(lvl).recip(),
      max: 100,
      desc(eff) {
        return `Block health is now ${formatChange(eff, 2)}<br>
        Everyone deserves more progress!`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 5).amt.gte(1)
    }),
    new Upgrade({
      name: "Coordination",
      cost: () => D(25000),
      // tbd
      eff: (lvl) =>
        getMiner(0)
          .amt.add(getMiner(1).amt)
          .add(getMiner(2).amt)
          .add(getMiner(3).amt)
          .add(10)
          .log10(),
      desc(eff) {
        return `<span class="tooltip">
          ${format(eff)}x to miner effectiveness based on amount of miners.
          <span class="tooltiptext">log<sub>10</sub>(miner amount + 10)</span>
        </span><br>
        Teamwork?`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 6).amt.gte(1)
    }),
    new Upgrade({
      name: "SSH Hashing...?", // DONT CHANGE MY GIVEN GP NAMES
      // DIDN'T META SAY NO CRYPTOCURRENCY REFERENCES?
      // ALSO HOW DO YOU HASH AN INTERNET PROTOCOL
      // SSH HASHING ISNT CRYPTO REFRENCE ITS A METHOD TO VALIDATE DATA PACKETS FROM SOURCES THEY COME FROM
      cost: () => D(125000),
      eff: (lvl) => RESOURCES.greenPaper.amt.add(10).log10(),
      desc(eff) {
        return `Gain <span class="tooltip">
          ${format(
            eff
          )}x more Green Papers based on your GP but raise resource buy cost as well.
          <span class="tooltiptext">log<sub>10</sub>(Green Papers + 10)</span>
        </span><br>
        Yes hashing an internet protocol in medival age...`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 7).amt.gte(1)
    }),
    new Upgrade({
      name: "More Pain, Ore Greed",
      cost: () => D(5000000),
      eff: (lvl) => D(10).pow(D(player.quarry.depth).sub(75).div(50)),
      desc(eff) {
        return `Gain <span class="tooltip">
          ${format(eff)}x Ores based on depth
          <span class="tooltiptext">10<sup><frac>(depth - 75)<div>50</div></frac></span>
        </span>`;
      },
      group: "GreenPapers",
      unl: () =>
        getUpgrade("GreenPapers", 8).amt.gte(1) && D(player.quarry.depth).gt(75)
    }),
    new Upgrade({
      name: "Into The Deep",
      // Free to prevent soft-locking
      cost: () => D(0),
      eff: () => 1,
      desc(eff) {
        return `Unlock Collapse.<br>
        Requires 100 Depth!`;
      },
      group: "GreenPapers",
      unl: () =>
        getUpgrade("GreenPapers", 9).amt.gte(1) &&
        D(player.quarry.depth).gte(100)
    })
  ]
};

TABS.GreenPapers = {
  disp: "Upgrades",
  parent: "Quarry",
  component: {
    template: `
    <div>
      <resource name="greenPaper"/><br>
      <upgrades group="GreenPapers"/>
    </div>
    `
  }
};
