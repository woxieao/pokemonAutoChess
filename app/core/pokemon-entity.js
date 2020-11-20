const schema = require('@colyseus/schema');
const STATE_TYPE = require('../models/enum').STATE_TYPE;
const ORIENTATION = require('../models/enum').ORIENTATION;
const MovingState = require('./moving-state');
const AttackingState = require('./attacking-state');
const uniqid = require('uniqid');
const Items = require('../models/items');
const ArraySchema = schema.ArraySchema;
const PokemonFactory = require('../models/pokemon-factory');

class PokemonEntity extends schema.Schema {
  constructor(name, index, positionX, positionY, hp, maxMana, atk, atkSpeed, def, speDef, attackType, range, team, attackSprite, rarity, sheet, types, items, stars, simulation, skill) {
    super();

    this.state = new MovingState();
    this.effects = new ArraySchema();
    this.items = new Items(items);
    this.simulation = simulation;
    this.strategy = PokemonFactory.createStrategyFromName(skill);
    this.assign(
      {
        id: uniqid(),
        rarity: rarity,
        sheet: sheet,
        positionX: positionX,
        positionY: positionY,
        targetX: -1,
        targetY: -1,
        index: index,
        name: name,
        action: STATE_TYPE.MOVING,
        orientation: ORIENTATION.DOWNLEFT,
        baseAtk: atk,
        baseDef: def,
        atk: atk,
        def: def,
        baseSpeDef: speDef,
        speDef: speDef,
        attackType: attackType,
        hp: hp,
        maxMana:maxMana,
        mana:0,
        life: hp,
        atkSpeed: atkSpeed,
        range: range,
        cooldown: 1000,
        manaCooldown:1000,
        team: team,
        attackSprite: attackSprite,
        types: [],
        damageDone: 0,
        stars: stars,
        skill: skill
      }
    )

    types.forEach((type) => {
      this.types.push(type);
    });
  }

  update(dt, board, climate) {
    this.state.update(this, dt, board, climate);
  }
  
  handleDamage(damage, board, attackType, attacker) {
    return this.state.handleDamage(this, damage, board, attackType, attacker);
  }

  changeState(state) {
    this.state.onExit(this);
    this.state = state;
    this.state.onEnter(this);
  }

  toMovingState() {
    this.changeState(new MovingState(this.simulation));
  }

  toAttackingState() {
    this.changeState(new AttackingState(this.simulation));
  }
}

schema.defineTypes(PokemonEntity, {
  positionX: 'uint8',
  positionY: 'uint8',
  action: 'string',
  index: 'uint16',
  id: 'string',
  orientation: 'string',
  hp: 'uint16',
  mana: 'uint8',
  maxMana: 'uint8',
  atk: 'uint16',
  def: 'uint16',
  speDef: 'uint16',
  attackType: 'string',
  life: 'uint16',
  team: 'uint8',
  range: 'uint8',
  atkSpeed: 'uint16',
  targetX: 'int8',
  targetY: 'int8',
  attackSprite: 'string',
  sheet: 'string',
  rarity: 'string',
  name: 'string',
  effects: ['string'],
  items:Items,
  stars:'uint8',
  skill:'string'
});

module.exports = PokemonEntity;
