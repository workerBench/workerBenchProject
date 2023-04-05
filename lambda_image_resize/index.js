const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3Client = new AWS.S3();

exports.handler = async (event) => {
  const Bucket = event.Records[0].s3.bucket.name; // 업로드된 버킷명
  const Key = event.Records[0].s3.object.key; // 업로드된 키명
  const s3objOption = { Bucket, Key };

  // 만약 key 이름에 video 가 삽입되어 있다? 해당 put 이벤트가 발생한 객체는 비디오 파일에 대한 객체. 따라서 동작은 그만둔다.
  if (Key.includes('video')) {
    return { statusCode: 200, message: 'Video is not edited' };
  }

  const workshop_id = Key.split('/')[Key.split('/').length - 3]; // workshop id
  const imageCategory = Key.split('/')[1]; // workshops or reviews
  const filename = Key.split('/')[Key.split('/').length - 1]; // 파일명

  try {
    // put 된 이미지 객체 불러오기
    const S3ImageObject = await s3Client.getObject(s3objOption).promise();

    // 리사이징
    const resizedImage = await sharp(S3ImageObject.Body).resize(800).toBuffer();

    // 리사이징된 객체 넣기
    await s3Client
      .putObject({
        Bucket: '나의 output 용 버킷 이름',
        Key: `images/${imageCategory}/${workshop_id}/800/${filename}`,
        Body: resizedImage,
      })
      .promise();

    // HTTP 요청에 대한 응답. 람다 콘솔 테스트 탭에서 확인 가능.
    return { statusCode: 200, body: event };
  } catch (err) {
    console.log('this is error');
    console.log(err);
    return { statusCode: 500, body: event };
  }
};
