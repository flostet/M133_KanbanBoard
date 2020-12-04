import { Application, Router, send } from "https://deno.land/x/oak@v6.3.1/mod.ts"
const app = new Application()
const router = new Router()

let cards = [];

const columns = [
  { id: 0, title: 'ToDo' },
  { id: 1, title: 'in Progress' },
  { id: 2, title: 'Done' },
];

let IDcounter = 0;

cards = [
  ...cards,
  {
      "description": "Run the tests",
      "status": "Done",
      "id": IDcounter++,
  },
  {
      "description": "create new Project",
      "status": "in Progress",
      "id": IDcounter++,
  },
  {
      "description": "design UI",
      "status": "ToDo",
      "id": IDcounter++,
  }
];

router
    .get('/columns', context => context.response.body = columns)
    .get("/cards", context => context.response.body = cards)
    .get("/cards/:id", context => {
        const index = cards.findIndex(c => c.id == context.params.id);
        context.response.body = cards[index]
        
    })
    .post("/cards", async context => {
        const card = await context.request.body({ type: "json" }).value;
        card.id = IDcounter++;
        cards = [
            ...cards,
            card
        ];
        context.response.body = card;
    })
    .delete("/cards/:id", context => {
        cards = cards.filter(c => c.id != context.params.id);
        context.response.status = 200;
    })
    .put("/cards/:id", async context => {
        const card = await context.request.body({ type: "json" }).value;
        const index = cards.findIndex(c => c.id == context.params.id);
        card.id = cards[index].id;
        cards[index] = card;
        context.response.body = cards[index];
    });

app.use(router.routes());
app.use(async context => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/frontend`,
      index: "index.html",
    });
  });
app.listen({ port: 8000 })