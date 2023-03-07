import { setSeederFactory } from 'typeorm-extension';
import { WorkShop } from '../../entities/workshop';

export default setSeederFactory(WorkShop, (faker) => {
  // category 요소 배열
  const onOffArr = ['online', 'offline'];

  // status 요소 배열
  const statusArr = ['request', 'approval', 'rejected', 'finished'];

  // 배열 요소를 랜덤하게 추출하는 함수
  const randomItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const workshop = new WorkShop();
  workshop.title = faker.random.words(3);
  workshop.category = randomItem(onOffArr); // 'online', 'offline' 중 랜덤하게 삽입
  workshop.desc = faker.lorem.paragraph();
  workshop.thumb = faker.image.imageUrl();
  workshop.min_member = faker.datatype.number();
  workshop.max_member = faker.datatype.number();
  workshop.total_time = faker.datatype.number();
  workshop.price = faker.datatype.number();
  workshop.status = randomItem(statusArr); // status 값 중 랜덤하게 삽입
  workshop.location = faker.address.city();
  workshop.user_id = faker.datatype.number();
  workshop.genre_id = faker.datatype.number();

  return workshop;
});
