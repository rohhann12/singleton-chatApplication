import { pubsubManager, userType } from "./initializer";
const pubSub = pubsubManager.getInstance();

const stockNames = ["AAPL", "GOOGL", "MSFT"];
pubSub.subscribe(stockNames, userType.USER);

setTimeout(() => {
    console.log("\n📢 Publishing stock updates...\n");
        const update1=[{
            Price:[100,1001,10001],
            Name:stockNames[0],
            closedAt: 158, 
            openedAt: 148 
        }]
        const update2=[{
            Price:[51100,51001,510001],
            Name:stockNames[1],
            closedAt: 158, 
            openedAt: 148 
        }]
        const update3=[{
            Price:[8100,81001,810001],
            Name:stockNames[2],
            closedAt: 158, 
            openedAt: 148 
        }]
        pubSub.publishHelper(userType.ADMIN, stockNames[0], update1);
        pubSub.publishHelper(userType.ADMIN, stockNames[1], update2);
        pubSub.publishHelper(userType.ADMIN, stockNames[2], update3);
}, 1000);
