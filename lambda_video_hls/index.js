const AWS = require('aws-sdk');

const s3Client = new AWS.S3();

// region
const aws_s3_region = 'ap-northeast-2';

// s3 setup
AWS.config.update({ region: aws_s3_region });
// media convert endpoint
AWS.config.mediaconvert = {
  endpoint: 'https://bnklbqvoa.mediaconvert.ap-northeast-2.amazonaws.com',
};

// create the client
// const mediaConvert = new AWS.MediaConvert({ apiVersion: "2017-08-29" });

// output bucket
const AWS_S3_BUCKET_NAME_VIDEO_OUTPUT = '나의 output 용 버킷 이름';
// convert type array
const convertType = ['1280x720_hls', '1920x1080_hls'];
// S3 와 API 게이트웨이에 접속하기 위한 권한.
const media_convert_role = 'arn:aws:iam::000000000000:role/role_mediaconvert';

exports.handler = async (event) => {
  const Bucket = event.Records[0].s3.bucket.name; // 업로드된 버킷명
  const Key = event.Records[0].s3.object.key; // 업로드된 키명 (따라서 경로를 포함)

  const workshopFolderName = Key.split('/')[0]; // videos
  const videoCategory = Key.split('/')[1]; // workshops or reviews
  const content_id = Key.split('/')[Key.split('/').length - 3]; // workshop id or review id
  const filename = Key.split('/')[Key.split('/').length - 1]; // 파일명

  /*
	input 경로를 만들어 준다. 즉 input 버킷에 업로드 된 원본 영상
  ex) s3://workerbench-msdou-video-input/videos/workshops/1/original/dd98b929-8236-4f98-bb1f-bf5bee6cdf66.mov
	*/
  const s3_video_input_source = `s3://${Bucket}/${Key}`;
  /*
	output 경로를 만들어 준다. 즉 input 버킷에 업로드 된 영상을 convert 하여 저장하고 싶은 곳
  ex) s3://workerbench-msdou-video-output/videos/workshops/1/hls/
	*/
  const s3_video_output_source = `s3://${AWS_S3_BUCKET_NAME_VIDEO_OUTPUT}/${workshopFolderName}/${videoCategory}/${content_id}/hls/`;

  try {
    // job 생성 ------------------------------------------
    const job = await new AWS.MediaConvert({
      apiVersion: '2017-08-29',
    })
      .createJob({
        Role: media_convert_role,
        Settings: {
          TimecodeConfig: {
            Source: 'ZEROBASED',
          },
          OutputGroups: [
            {
              CustomName: 'video_to_output',
              Name: 'Apple HLS',
              Outputs: [
                {
                  ContainerSettings: {
                    Container: 'M3U8',
                    M3u8Settings: {},
                  },
                  VideoDescription: {
                    Width: 720,
                    Height: 480,
                    CodecSettings: {
                      Codec: 'H_264',
                      H264Settings: {
                        MaxBitrate: 1500000,
                        RateControlMode: 'QVBR',
                        SceneChangeDetect: 'TRANSITION_DETECTION',
                      },
                    },
                  },
                  AudioDescriptions: [
                    {
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 96000,
                          CodingMode: 'CODING_MODE_2_0',
                          SampleRate: 48000,
                        },
                      },
                    },
                  ],
                  OutputSettings: {
                    HlsSettings: {},
                  },
                  NameModifier: '720x480_1.5mbps_qvbr',
                },
                {
                  ContainerSettings: {
                    Container: 'M3U8',
                    M3u8Settings: {},
                  },
                  VideoDescription: {
                    Width: 1280,
                    Height: 720,
                    CodecSettings: {
                      Codec: 'H_264',
                      H264Settings: {
                        MaxBitrate: 4000000,
                        RateControlMode: 'QVBR',
                        SceneChangeDetect: 'TRANSITION_DETECTION',
                      },
                    },
                  },
                  AudioDescriptions: [
                    {
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 96000,
                          CodingMode: 'CODING_MODE_2_0',
                          SampleRate: 48000,
                        },
                      },
                    },
                  ],
                  OutputSettings: {
                    HlsSettings: {},
                  },
                  NameModifier: '1280x720_4mbps_qvbr',
                },
                {
                  ContainerSettings: {
                    Container: 'M3U8',
                    M3u8Settings: {},
                  },
                  VideoDescription: {
                    Width: 1920,
                    Height: 1080,
                    CodecSettings: {
                      Codec: 'H_264',
                      H264Settings: {
                        MaxBitrate: 8000000,
                        RateControlMode: 'QVBR',
                        SceneChangeDetect: 'TRANSITION_DETECTION',
                      },
                    },
                  },
                  AudioDescriptions: [
                    {
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 96000,
                          CodingMode: 'CODING_MODE_2_0',
                          SampleRate: 48000,
                        },
                      },
                    },
                  ],
                  OutputSettings: {
                    HlsSettings: {},
                  },
                  NameModifier: '1920x1080_8mbps_qvbr',
                },
              ],
              OutputGroupSettings: {
                Type: 'HLS_GROUP_SETTINGS',
                HlsGroupSettings: {
                  SegmentLength: 10,
                  Destination: s3_video_output_source,
                  MinSegmentLength: 0,
                },
              },
            },
          ],
          Inputs: [
            {
              AudioSelectors: {
                'Audio Selector 1': {
                  DefaultSelection: 'DEFAULT',
                },
              },
              VideoSelector: {
                Rotate: 'AUTO',
              },
              TimecodeSource: 'ZEROBASED',
              FileInput: s3_video_input_source,
            },
          ],
        },
        AccelerationSettings: {
          Mode: 'DISABLED',
        },
        StatusUpdateInterval: 'SECONDS_60',
        Priority: 0,
      })
      .promise();

    return { success: true, statusCode: 200 };
  } catch (err) {
    return { success: false, statusCode: 500, error: err };
  }
};
